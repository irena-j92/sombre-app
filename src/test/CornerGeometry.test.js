import { describe, expect, it } from 'vitest';
import { cornerPoint, PAGE_ASPECT } from '../lib/pageTurn/geometry.js';

describe('Reference-style corner peel', () => {
  it('keeps the page completely flat before a turn', () => {
    for (const [u,v] of [[0,0],[1,0],[0,1],[1,1],[.5,.5]]) {
      const point=cornerPoint(u,v,0);
      expect(point.x).toBeCloseTo(u);
      expect(point.y).toBeCloseTo(v*PAGE_ASPECT);
      expect(point.z).toBe(0);
    }
  });
  it('lifts the bottom-right corner while the top edge remains flat', () => {
    expect(cornerPoint(1,0,.15).z).toBeGreaterThan(.1);
    expect(cornerPoint(1,1,.15).z).toBe(0);
    expect(cornerPoint(0,1,.15).z).toBe(0);
    expect(cornerPoint(0,0,.15).z).toBe(0);
  });
  it('mirrors the peel for previous pages and clears the destination at completion', () => {
    const forward=cornerPoint(.8,.2,.3,1);
    const backward=cornerPoint(.2,.2,.3,-1);
    expect(backward.x).toBeCloseTo(1-forward.x);
    expect(backward.y).toBeCloseTo(forward.y);
    for(let row=0;row<=12;row++)for(let col=0;col<=12;col++){
      expect(cornerPoint(col/12,row/12,1,1).x).toBeLessThan(0);
      expect(cornerPoint(col/12,row/12,1,-1).x).toBeGreaterThan(1);
    }
  });
});
