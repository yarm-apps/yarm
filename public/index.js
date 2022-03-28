// import EditorJS from "../libs/editor.js/dist/editor";
import EditorJS from "@editorjs/editorjs";

import DragDrop from 'editorjs-drag-drop';
 
import FileSaver from "file-saver";

const json1 = require('ot-json1');

import yTitle from "./js/yTitle"
import ySection from "./js/ySection"
import yRequirement from "./js/yRequirement"

//---------------------------------------

// import _data from './samples/initial.json';
import _data from './samples/yarm_requirements.json';

//---------------------------------------

let currentData = loadData() || {..._data};

// let currentData = {..._data};

const saveTimeout = 3000;

let shouldSave = false;

/**
   * Initialize the Editor
   */


let editor = new EditorJS({
    autofocus: true,
    // defaultBlock: 'ytitle',
    tools: {
        ytitle: {
            class: yTitle,
        },
        ysection: {
            class: ySection,
        },
        yrequirement: {
            class: yRequirement,
        }
    },
    data: currentData["data"],
    onChange: (_editor, event) => {
        window._event = event;
        let targetBlock = event['detail']['target'];
        let index = event['detail']['index'];
        let fromIndex = event['detail']['fromIndex'];
        let toIndex = event['detail']['toIndex'];

        console.log("onChange:  ", event);
        targetBlock.save().then((data) => {
            console.log("saved ", data);
            let op = null;

            let processedData = {
                type: data["tool"],
                id: data["id"],
                data: data["data"],
            }
            
            processedData["data"]["id"] = data["id"];

            switch(event['type']) {
                case 'block-changed': {
                    let source_data = {...currentData["data"]["blocks"][index]};
                    console.log(source_data);
                    op = json1.replaceOp(["blocks", index], source_data, processedData);
                } break;
                case 'block-moved': {
                    op = json1.moveOp(["blocks", fromIndex], ["blocks", toIndex]);
                } break;
                case 'block-added': {
                    op = json1.insertOp(["blocks", index], processedData);
                } break;
                case 'block-removed': {
                    op = json1.removeOp(["blocks", index]);
                } break;
            }

            if(op) {
                console.log("Operation: ", op);
                console.log("Blocks before: ", currentData["data"].blocks);
                currentData["data"] = json1.type.apply(currentData["data"], op);
                console.log("Blocks after: ", currentData["data"].blocks);
            }
            
            currentData["history"].push(op)

            shouldSave = true;
        });
    },
    onReady: () => {
        new DragDrop(editor);
    },
});

  
/**
 * Add handler for the Save button
 */
const saveButton = document.getElementById('save-button');
const loadButton = document.getElementById('load-button');
const importButton = document.getElementById('import-button');
const exportButton = document.getElementById('export-button');

saveButton.addEventListener('click', () => {
    saveToLocalStorage();
})

loadButton.addEventListener('click', () => {
    console.log('load button');
    loadData();
})

importButton.addEventListener('click', () => {
    
});

exportButton.addEventListener('click', () => {
    saveToFile();
});

document.addEventListener("keydown", function(e) {
    console.log(e);

    //Saving to file on Cmd + Shift + S
    if ((window.navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)  && e.code == "KeyS" && (e.shiftKey)) {
        e.preventDefault();
        saveToFile();
    }
}, false);

setInterval(() => {
    if(shouldSave) {
        saveToLocalStorage();
    }
}, saveTimeout);
//------------------------

function loadData() {
    console.log('loadData');
    let data = window.localStorage.getItem("saved");

    
    if(data) {
        data = JSON.parse(data);
        console.log(data);
        return data;
    } else {
        return _data;
    }
}

function save() {
    return editor.save().then( savedData => {
        console.log(savedData);
        let toSave = {
            "data": savedData,
            "history": currentData["history"]
        }
        return toSave;
    });
}

function saveToLocalStorage() {
    save().then( savedData => {
        console.log(savedData);
        window.localStorage.setItem("saved", JSON.stringify(savedData, null, 4))
    });
}

function saveToFile() {
    save().then(savedData => {
        console.log(savedData);
        let str = JSON.stringify(savedData, null, 4);
        console.log(str);
        var blob = new Blob([str], {type: "text/plain;charset=utf-8"});

        FileSaver.saveAs(blob, "yarm_requirements.json");
    });
}
//------------------------

window.editor = editor;
window.json1 = json1;
window.currentData = currentData;