//var html = require('html-loader!test.html');

// import MutationObserver from 'mutation-observer';
//global.MutationObserver = require('mutation-observer'); /// MutationObserver 

//import {VideoPlayerContainer} from "../src/video_player_container.js";

const vcontainer = require("../src/video_player_container");
const JSDOM = require('jsdom');


const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.resolve(__dirname, 'test.html'), 'utf8');
const controlgrouphtml = fs.readFileSync(path.resolve(__dirname, 'controlgroup.html'), 'utf8');


/*
test("sample test", async ()=>{
    //fetch.mockReturnValue();
    const r = await fetch("url");
    //fetch.
});
*/
/*beforeAll(() => {
    global.MutationObserver = class {
      constructor() {
        this.count = 0;
      }
      disconnect() {}
      observe() {
          this.count += 1;
      }
    };
  });

  afterAll(() => {
    delete global.MutationObserver;
  });
*/

test("Some test", async () => {
    const htmlContent = html.toString();
    //console.log(htmlContent);
    document.body.innerHTML = htmlContent;
    
    var container = new vcontainer.VideoPlayerContainer();
    container.run();

    expect(container.players.length).toBe(1);
    expect(container.players[0].controlGroup).toBeNull();

    const wrapperElem = document.getElementsByClassName("control-group-wrapper")[0];
    wrapperElem.innerHTML = controlgrouphtml.toString();

    //expect(container.players[0].controlGroupObserver.count).toBe(1);
    await waitFor(() => expect(container.players[0].controlGroup).not.toBeNull());
    
});