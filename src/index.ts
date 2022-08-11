import axios from 'axios';
import * as cheerio from 'cheerio';
import { promises as fs } from 'fs';
import { v4 as uuid } from 'uuid';

import './LoadEnv';
import app from './server';
import { ICoworker } from './coworker/coworker.model';

const port = Number(process.env.PORT || 3000);
const fileName = process.env.STORGE_FILE_NAME || 'coworkers-data.json';
// 15 retries looks unreasonable, but sometimes it takes up to 12 attempts until success
const retryAttempts = 15;

interface contentItem {
  name: string;
  portraitUrl: string;
}

const baseUrlToScrap = 'https://tretton37.com';
const meetPath = '/meet';
// TODO: split the following logic in more atomic way
try {
  (async () => {
    const response = await axios.get(`${baseUrlToScrap}${meetPath}`);
    const $ = cheerio.load(response.data);

    const coworkers: ICoworker[] = [];

    $('.ninja-summary').each(function (i, element) {
      const imagePortraitUrl = $('.portrait', $(this)).attr('src');
      const name = $('.portrait', $(this)).attr('alt');
      const [country, city] = $('h1 a span', $(this)).text().split(' ');
      const coworkerDetailsPath = $('a', $(this)).attr('href');
      const id = uuid();

      coworkers.push({ id, country, city, imagePortraitUrl, name, imageFullUrl: '', text: '', coworkerDetailsPath });
    });


    let score = 0;
    let total = 0;
    const coworkersWithDetails = coworkers.map(async (coworker, index) => {
      const detailsPathFull = `${baseUrlToScrap}/${coworker.coworkerDetailsPath}`;
      let coworkerResponse;
      let attemptsLeft = retryAttempts;
      let isError = false;
      while (attemptsLeft) {
        try {
          coworkerResponse = await axios(detailsPathFull);
          isError = false;
          break;
        } catch (e) {
          attemptsLeft--;
          isError = true;
        }
      }
      total++;
      isError ? score-- : score++;
      console.log(`Dev: Coworker's details have ${isError ? 'not ' : ''}been obtained after ${retryAttempts - attemptsLeft} attempts`);
      console.log(`Dev: Success/Total: ${score}/${total}`);
      if (isError) {
        return coworker;
      }
      const $ = cheerio.load(coworkerResponse.data);
      const imageFullUrl = $('image').attr('href');
      const text = $('.main-ninja-text').html();
      delete coworker.coworkerDetailsPath;
      return {
        ...coworker,
        imageFullUrl,
        text
      };
    });
    const scrapingResult = await Promise.all(coworkersWithDetails);
    const scrapingResultJson = JSON.stringify(scrapingResult);
    await fs.writeFile(fileName, scrapingResultJson);

    console.log('Dev: scraping has been completed successfully.');
  })();
} catch (error) {
  console.log(error, error.message);
  throw new Error('something is wrong');
}


const server = app.listen(port, () => {
	console.log('express server started on port: ' + port);
});

export default server;
