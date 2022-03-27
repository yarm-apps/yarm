import yBlock from "./yBlock"

/**
 *
 * @typedef {object} ySection — Input/Output data format for our Tool
 * @property {string} title - header to show
 * @property {string} id - image caption
 * @property {boolean} withBorder - flag for adding a border
 * @property {boolean} withBackground - flag for adding a background
 * @property {boolean} stretched - flag for stretching image to the full width of content
 *
 * @typedef {object} ImageToolConfig
 * @property {string} placeholder — custom placeholder for URL field
 */

const ySectionIcons = [
    {
        name: 'withBorder',
        icon: `<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M15.8 10.592v2.043h2.35v2.138H15.8v2.232h-2.25v-2.232h-2.4v-2.138h2.4v-2.28h2.25v.237h1.15-1.15zM1.9 8.455v-3.42c0-1.154.985-2.09 2.2-2.09h4.2v2.137H4.15v3.373H1.9zm0 2.137h2.25v3.325H8.3v2.138H4.1c-1.215 0-2.2-.936-2.2-2.09v-3.373zm15.05-2.137H14.7V5.082h-4.15V2.945h4.2c1.215 0 2.2.936 2.2 2.09v3.42z"/></svg>`
    },
    {
        name: 'stretched',
        icon: `<svg width="17" height="10" viewBox="0 0 17 10" xmlns="http://www.w3.org/2000/svg"><path d="M13.568 5.925H4.056l1.703 1.703a1.125 1.125 0 0 1-1.59 1.591L.962 6.014A1.069 1.069 0 0 1 .588 4.26L4.38.469a1.069 1.069 0 0 1 1.512 1.511L4.084 3.787h9.606l-1.85-1.85a1.069 1.069 0 1 1 1.512-1.51l3.792 3.791a1.069 1.069 0 0 1-.475 1.788L13.514 9.16a1.125 1.125 0 0 1-1.59-1.591l1.644-1.644z"/></svg>`
    },
    {
        name: 'withBackground',
        icon: `<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.043 8.265l3.183-3.183h-2.924L4.75 10.636v2.923l4.15-4.15v2.351l-2.158 2.159H8.9v2.137H4.7c-1.215 0-2.2-.936-2.2-2.09v-8.93c0-1.154.985-2.09 2.2-2.09h10.663l.033-.033.034.034c1.178.04 2.12.96 2.12 2.089v3.23H15.3V5.359l-2.906 2.906h-2.35zM7.951 5.082H4.75v3.201l3.201-3.2zm5.099 7.078v3.04h4.15v-3.04h-4.15zm-1.1-2.137h6.35c.635 0 1.15.489 1.15 1.092v5.13c0 .603-.515 1.092-1.15 1.092h-6.35c-.635 0-1.15-.489-1.15-1.092v-5.13c0-.603.515-1.092 1.15-1.092z"/></svg>`
    }
];


export default class ySection extends yBlock {
    
    // _inputId;
    // _inputHeader; //html element to hold input header
  
    /**
     * Tool class constructor
     * @param {ImageToolData} data — previously saved data
     * @param {object} api — Editor.js Core API {@link  https://editorjs.io/api}
     * @param {ImageToolConfig} config — custom config that we provide to our tool's user
     */
    constructor({data, api, config}) {
        super();
        this.api = api;
        this.config = config || {};

        this.data = {
            id: data.id || '',
            header: data.header || '', 
        };
        
        this.id = this.data.id;
        this.wrapper = undefined;

        this.onKeyUp = this.onKeyUp.bind(this);
    }
  
    /**
   * Check if text content is empty and set empty string to inner html.
   * We need this because some browsers (e.g. Safari) insert <br> into empty contenteditanle elements
   *
   * @param {KeyboardEvent} e - key up event
   */
    onKeyUp(e) {
        if (e.code !== 'Backspace' && e.code !== 'Delete') {
        return;
        }

        const {textContent} = this._inputHeader;

        if (textContent === '') {
        this._inputHeader.innerHTML = '';
        }
    }

    /**
     * Return a Tool's UI
     * @return {HTMLElement}
     */
    render() {
        this.wrapper = document.createElement('div');
        
        this.wrapper.addEventListener('keyup', this.onKeyUp);


        this.wrapper.classList.add('ysection');

        this._inputId = document.createElement('input');
        this._inputId.classList.add('inputID');
        this._inputId.setAttribute("placeholder", 'ID');
        this._inputId.value = this.data.id && this.data.id ? this.data.id : '';
        
        this._inputHeader = document.createElement('div');
        this._inputHeader.contentEditable = "true";
        this._inputHeader.setAttribute("placeholder", 'Section');
        this._inputHeader.classList.add('Section');
        this._inputHeader.innerHTML = this.data.header && this.data.header ? this.data.header : '';

        // //-------------------------
        
        this.wrapper.appendChild(this._inputId);
        this.wrapper.appendChild(this._inputHeader);

        // _acceptTuneView();
        return this.wrapper;
    }
    
    /**
     * Making a Block settings: 'add border', 'add background', 'stretch to full width'
     * @see https://editorjs.io/making-a-block-settings — tutorial
     * @see https://editorjs.io/tools-api#rendersettings - API method description
     * @return {HTMLDivElement}
     */
     renderSettings() {
        const wrapper = document.createElement('div');
    
        ySectionIcons.forEach( tune => {
            let button = document.createElement('div');
    
            button.classList.add(this.api.styles.settingsButton);
            button.classList.toggle(this.api.styles.settingsButtonActive, this.data[tune.name]);
            button.innerHTML = tune.icon;
            wrapper.appendChild(button);
    
            button.addEventListener('click', () => {
                this._toggleTune(tune.name);
                button.classList.toggle(this.api.styles.settingsButtonActive);
            });
        });
    
        return wrapper;
    }
  
    /**
     * Extract data from the UI
     * @param {HTMLElement} blockContent — element returned by render method
     * @return {ySectionData}
     */
    save(blockContent) {
        return Object.assign(this.data, {
            id: this._inputId.innerHTML,
            header: this._inputHeader.innerHTML
        });
    }
  
    /**
     * Skip empty blocks
     * @see {@link https://editorjs.io/saved-data-validation}
     * @param {ySectionToolConfig} savedData
     * @return {boolean}
     */
    validate(savedData) {

        return true;
    }
  
    /**
     * @private
     * Click on the Settings Button
     * @param {string} tune — tune name from this.settings
     */
    _toggleTune(tune) {
        this.data[tune] = !this.data[tune];
        this._acceptTuneView();
    }
  
    /**
     * Add specified class corresponds with activated tunes
     * @private
     */
    _acceptTuneView() {
      ySectionIcons.forEach( tune => {
            this.wrapper.classList.toggle(tune.name, !!this.data[tune.name]);
    
            if (tune.name === 'stretched') {
                this.api.blocks.stretchBlock(this.api.blocks.getCurrentBlockIndex(), !!this.data.stretched);
            }
        });
    }
  
    /**
     * Handle paste event
     * @see https://editorjs.io/tools-api#onpaste - API description
     * @param {CustomEvent }event
     */
    onPaste(event) {
        switch (event.type) {
            case 'tag':
                const imgTag = event.detail.data;
                this._createTitle(imgTag.src);
            break;
            case 'file':
                /* We need to read file here as base64 string */
                const file = event.detail.file;
                const reader = new FileReader();
        
                reader.onload = (loadEvent) => {
                    this._createTitle(loadEvent.target.result);
                };
        
                reader.readAsDataURL(file);
            break;
            case 'pattern':
                const src = event.detail.data;
        
                this._createTitle(src);
            break;
        }
    }

    /**
     * Our tool should be placed at the Toolbox, so describe an icon and title
     */
     static get toolbox() {
        return {
            title: 'Section',
            icon: '<i class="ySectionToolIcon"></i>'
        };
    }
  
    /**
     * Allow render Image Blocks by pasting HTML tags, files and URLs
     * @see {@link https://editorjs.io/paste-substitutions}
     * @return {{tags: string[], files: {mimeTypes: string[], extensions: string[]}, patterns: {image: RegExp}}}
     */
    static get pasteConfig() {
        return {
            tags: ['ySection'],
            files: {
                mimeTypes: ['image/*'],
                extensions: ['gif', 'jpg', 'png'] // You can specify extensions instead of mime-types
            },
            patterns: {
                image: /https?:\/\/\S+\.(gif|jpe?g|tiff|png)$/i 
            }
        }
    }
  
    /**
     * Automatic sanitize config
     * @see {@link https://editorjs.io/sanitize-saved-data}
     */
    static get sanitize() {
      return {
        url: {},
        caption: {
            b: true,
            a: {
                href: true
            },
            i: true
        }
      }
    }

}