import {
  buildBlock, decorateBlock, loadBlock, toClassName,
} from '../../scripts/aem.js';
import ffetch from '../../scripts/ffetch.js';
import {
  div, span, h2, h3,
} from '../../scripts/dom-helpers.js';
import { renderBlock } from '../../scripts/faintly.js';

/**
 * @param {Date} date the date
 * @returns the formatted date string
 */
const formatDate = (date) => `${date.getUTCMonth() + 1}/${date.getUTCDate()}/${date.getUTCFullYear()}`;

const renderGraphCard = (cycleData, name) => {
  const card = div(
    { class: `session-card ${toClassName(name)}` },
    h3(name),
    div({ class: 'cycle-graph' }),
  );

  const graph = card.querySelector('.cycle-graph');

  let curWeek = -1;
  let weekMaxSpeed = -1;
  let curWeekEl;
  cycleData.forEach((sessionData) => {
    if (sessionData.week !== curWeek) {
      if (curWeekEl) {
        curWeekEl.append(span({ class: 'week-max' }, weekMaxSpeed));
        weekMaxSpeed = -1;
      }
      curWeekEl = div({ class: 'week', 'data-week': sessionData.week });
      curWeek = sessionData.week;
      graph.append(curWeekEl);
    }
    if (weekMaxSpeed < sessionData.maxSpeed) {
      weekMaxSpeed = sessionData.maxSpeed;
    }
    curWeekEl.append(span({ 'data-protocol': sessionData.protocol }, sessionData.maxSpeed));
  });
  curWeekEl.append(span({ class: 'week-max' }, weekMaxSpeed));

  return card;
};

/**
 * decorate the form block
 * @param {Element} block the block element
 */
export default async function decorate(block) {
  const formLink = block.querySelector('a[href$=".json"]');
  if (!formLink) return;
  const { pathname } = new URL(formLink.href);

  block.innerHTML = '';

  const results = await ffetch(pathname)
    .sheet('data')
    .map((sessionData) => {
      const { date } = sessionData;
      const excelDate = +date > 99999
        ? new Date(+date * 1000)
        : new Date(Math.round((+date - (1 + 25567 + 1)) * 86400 * 1000));
      return {
        date: excelDate,
        maxSpeed: Number(sessionData['max speed']),
        cycle: Number(sessionData.cycle),
        week: Number(sessionData.week),
        protocol: Number(sessionData.protocol),
      };
    })
    .all();
  let maxSpeed = {
    maxSpeed: 0,
  };
  let mostRecentSession = {};
  let maxDate;
  results.forEach((sessionData) => {
    const { date } = sessionData;

    if (!maxDate || (maxDate.getTime() < date.getTime())) {
      maxDate = date;
      mostRecentSession = sessionData;
    }

    if (sessionData.maxSpeed > maxSpeed.maxSpeed) {
      maxSpeed = sessionData;
    }
  });

  const currentCycleInfo = results
    .filter((sessionData) => sessionData.cycle === mostRecentSession.cycle)
    .sort((a, b) => a.date - b.date);

  await renderBlock(block, {
    sessions: () => [
      {
        ...maxSpeed,
        name: 'Fastest Session',
      },
      {
        ...mostRecentSession,
        name: 'Last Session',
      },
    ],
    sessionClass: ({ session }) => toClassName(session.name),
    sessionDate: ({ session }) => formatDate(session.date),
    formBlock: async () => {
      const formBlock = buildBlock('form', formLink);
      block.append(formBlock);
      decorateBlock(formBlock);
      await loadBlock(formBlock);

      return formBlock;
    },
    currentCycleInfo,
  });
}
