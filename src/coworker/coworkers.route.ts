import { Router } from 'express';
import * as bodyParser from 'body-parser';

const { get, getById, updateById } = require('./coworker.controller');

const jsonParser = bodyParser.json();
const router = Router();

router.get('/coworkers', get);
router.get('/coworker/:id', getById);

// TODO: reconsider the HTTP method for updating (should be PUT instead of POST)
router.post('/coworker/', jsonParser, updateById);

export default router;
