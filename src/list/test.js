import '@testing-library/jest-dom/extend-expect';
import { JSDOM } from 'jsdom';

import { getLoesungOrOther } from '../utils';

const html = getLoesungOrOther('./loesung.html', './index.html', __dirname);

let dom
let container

describe('index.html', () => {
  beforeEach(() => {
    dom = new JSDOM(html, { runScripts: 'dangerously' })
    container = dom.window.document.body
  })

  it('assert that ul exists with three li elements', () => { 
    expect(container.querySelector('ul li').innerHTML).toBe("Limes");
    expect(container.querySelector('ul li:nth-of-type(2)').innerHTML).toBe("Tortillas");
    expect(container.querySelector('ul li:nth-of-type(3)').innerHTML).toBe("Chicken");
    
  })
})