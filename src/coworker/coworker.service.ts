import { promises as fs } from 'fs';
import { ICoworker, IPagination } from './coworker.model';

const fileName = process.env.STORGE_FILE_NAME || 'coworkers-data.json';


export class CoworkerService {
  public async getOne(targetId: string): Promise<ICoworker | null> {
    try {
      const dataRaw = await fs.readFile(fileName, 'utf8');
      const items: ICoworker[] = JSON.parse(dataRaw);

      const { name, text, imagePortraitUrl } = items.find(({ id }) => id === targetId) || {};
      return name
        ? { name, text, imagePortraitUrl }
        : null;
    } catch (err) {
      throw err;
    }
  }

  public async getAll(filter: string): Promise<IPagination<ICoworker>> {
    let items: ICoworker[];
    try {
      const dataRaw = await fs.readFile(fileName, 'utf8');
      items = JSON.parse(dataRaw);
    } catch (err) {
      throw err;
    }
    let filteredItems: ICoworker[] = items;
    if (filter) {
      try {
        filteredItems = items.filter(({ name }) => name.toLowerCase().match(filter));
      } catch (e) {
        console.log(e);
        filteredItems = [];
      }
    }

    return { totalLength: filteredItems?.length, data: filteredItems };
  }

  public async update(data: ICoworker): Promise<ICoworker | Record<string, never>> {
    const missingProps = this.validatePayload({ ...data })
      .reduce((acc: any, current) => {
        acc[current] = `${current} is required`;
        return acc;
      }, {});
    if (Object.keys(missingProps).length) {
      return {
        ...data,
        ...missingProps
      };
    }
    const { id: targetId } = data;

    try {
      const dataRaw = await fs.readFile(fileName, 'utf8');
      const coworkers: ICoworker[] = JSON.parse(dataRaw);

      const targetCoworker = coworkers.find(({id}) => id === targetId);
      if (!targetCoworker) {
        return null;
      }
      Object.assign(targetCoworker, data);
      const updatedCoworkersJson = JSON.stringify(coworkers);
      await fs.writeFile(fileName, updatedCoworkersJson);

      return {};
    } catch (err) {
      throw err;
    }
  }

  private validatePayload(payload: { [key: string]: string }): string[] {
    const requiredProps = ['city', 'name', 'text'];
    const missingProps: string[] = [];
    requiredProps.forEach((prop) => {
      const isValid = Object.keys(payload).includes(prop)
        && typeof payload[prop] === 'string'
        && Boolean(payload[prop].length);
      if (!isValid) {
        missingProps.push(prop);
      }
    });
    return missingProps;
  }
}
