/**!
 * @fileOverview Imoji.js - A sleek & responsive emoji input
 * @version 2.0.0
 * @license
 * MIT License
 *
 * Copyright (c) 2018 Jonas Hübotter
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
window.Imoji = new function() {

    this.input = null;
    this.emojis = {};

    this.init = function(options) {

        let defaults = {
            emojis: '../db/emojis.json',
            input: null
        };
        options = extend( {}, defaults, options );
        function extend() {
            for ( let i=1; i<arguments.length; i++ )
                for ( let key in arguments[i] )
                    if ( arguments[i].hasOwnProperty(key) )
                        arguments[0][key] = arguments[i][key];
            return arguments[0];
        };

        Imoji.input = options.input;

        let data = JSON.parse(require([options.emojis])),
            i = 0;
        while ( i++ < data.length ) {
            if ( typeof data[i] != 'undefined' && data[i].hasOwnProperty('category') ) {
                var key = data[i].category;
                if ( typeof Imoji.emojis[key] == 'undefined' )
                    Imoji.emojis[key] = [];
                Imoji.emojis[key].push(data[i]);
            };
        };
        Imoji.create();
        Imoji.render(Imoji.emojis);

        document.querySelectorAll('[data-imoji]').forEach((element) => {
            element.addEventListener( 'click', () => {
                if ( Imoji.input != false )
                    Imoji.input = this.closest('input');
                Imoji.open();
            });
        });

        document.querySelector('.imoji-picker--search-trigger').addEventListener( 'click', () => {
            if (document.querySelector('.imoji-picker').classList.contains('searching')) {
                Imoji.hideSearch();
            } else {
                Imoji.showSearch();
            };
        });

        document.querySelector('.imoji-picker--delete').addEventListener( 'click', () => {
            Imoji.deleteFromInput();
            Imoji.input.focus;
        });

        document.querySelector('input.imoji-picker--search-input').addEventListener( 'input', () => {
            if ( this.value == '' ) {
                Imoji.render(Imoji.emojis);
            } else {
                Imoji.search(this.value);
            };
        });

        document.querySelector('.imoji-picker--search-delete').addEventListener( 'click', () => {
            let searchInput = document.querySelector('input.imoji-picker--search-input')
            searchInput.value = '';
            searchInput.focus;
            Imoji.render(Imoji.emojis);
        });

        document.addEventListener( 'mouseup', (event) => {
            let container = document.querySelector('.imoji-picker');
            if ( container !== event.target && !container.contains(event.target) ) {
                Imoji.close();
            };
        });

        document.addEventListener( 'imoji:select', ( event, emoji ) => {
            if ( Imoji.input.length > 0 ) {
                Imoji.updateInput(emoji.emoji);
                Imoji.input.focus;
            };
        });

    };

    this.create = () => {
        Imoji.emojis.forEach( ( category, emojis ) => document.querySelector('.imoji-picker--categories').append('<div class="imoji-picker--categories-category imoji-icon" id="imoji-categories-footer--' + category + '">' + emojis[0].emoji + '</div>') );
        document.querySelectorAll('.imoji-picker--categories-category').addEventListener( 'click', () => Imoji.scrollToCategory(this.getAttribute('id').replace( 'imoji-categories-footer--', '' )) );
    };

    this.render = (emojis) => {
        let wrapper = document.querySelector('.imoji-picker--emojis');
        wrapper.classList.add('imoji--hide');
        setTimeout(() => {
            wrapper.innerHTML = '';

            emojis.forEach(( category, emojis ) => {
                if ( emojis.length > 0 ) {
                    document.querySelector( '#imoji-categories-footer--' + category ).classList.remove('disabled');
                    wrapper.appendChild('<div class="imoji-picker--emojis-category" id="imoji-categories--' + category + '"><h6>' + category + '</h6></div>');
                    let categoryWrapper = wrapper.querySelector( '#imoji-categories--' + category );
                    emojis.forEach( ( k, emoji ) => categoryWrapper.appendChild('<div class="imoji-picker--emojis-emoji imoji-icon imoji-icon--sm" id="imoji-emojis--' + emoji.aliases[0] + '">' + emoji.emoji + '</div>') );
                } else {
                    document.querySelector( '#imoji-categories-footer--' + category ).classList.add('disabled');
                };
            });

            wrapper.classList.remove('imoji--hide');

            document.querySelectorAll('.imoji-picker--emojis-emoji').addEventListener( 'click', () => {
                let alias = this.getAttribute('id').replace( 'imoji-emojis--', '' ),
                    emoji = [];
                Imoji.emojis.forEach(( category, emojis ) => {
                    if ( emoji.length == 0 ) {
                        emoji = emojis.filter( (e) => e.aliases[0] == alias );
                    };
                });
                Imoji.select(emoji[0]);
            });
        }, 250);
    };

    this.search = (query) => {
        let result = {};
        Imoji.emojis.forEach(( category, emojis ) => {
            result[category] = emojis.filter((e) => {
                let x = false;
                e.aliases.forEach((k, value) => {
                    if ( value.indexOf(query) != -1 )
                        x = true
                });
                e.tags.forEach((k, value) => {
                    if ( value.indexOf(query) != -1 )
                        x = true
                });
                return x;
            });
        });
        Imoji.render(result);
    };

    this.open = () => {
        if ( Imoji.input.length > 0 ) {
            document.querySelector('.imoji-picker--footer').classList.add('input-controls');
        } else {
            document.querySelector('.imoji-picker--footer').classList.remove('input-controls');
        };

        if (window.CustomEvent) {
            let event = new CustomEvent( 'imoji:open', {}  );
        } else {
            let event = document.createEvent('CustomEvent');
            event.initCustomEvent( 'imoji:open', true, true, {} );
        }
        document.dispatchEvent(event);
        document.querySelector('body').classList.add('imoji--open');
    };

    this.close = () => {
        if (window.CustomEvent) {
            let event = new CustomEvent( 'imoji:close', {}  );
        } else {
            let event = document.createEvent('CustomEvent');
            event.initCustomEvent( 'imoji:close', true, true, {} );
        }
        document.dispatchEvent(event);
        document.querySelector('body').classList.remove('imoji--open');
    };

    this.select = (emoji) => {
        if (window.CustomEvent) {
            let event = new CustomEvent( 'imoji:select', { detail: { emoji: emoji }}  );
        } else {
            let event = document.createEvent('CustomEvent');
            event.initCustomEvent( 'imoji:select', true, true, { emoji: emoji } );
        }
        document.dispatchEvent(event);
    };

    this.updateInput = (emoji) => {
        Imoji.input.value = Imoji.input.value + emoji;
    };

    this.deleteFromInput = () => {
        Imoji.input.value = Imoji.input.value.slice( 0, -1 );
    };

    this.showSearch = () => {
        document.querySelector('.imoji-picker--search').style.display = 'none';
        document.querySelector('.imoji-picker').classList.add('searching');
        setTimeout(() => {
            document.querySelector('.imoji-picker--search').classList.add('imoji-picker--search--shown');
            setTimeout(() => document.querySelector('input.imoji-picker--search-input').focus, 250 );
        }, 250);
    };

    this.hideSearch = () => {
        document.querySelector('.imoji-picker--search').classList.remove('imoji-picker--search--shown');
        setTimeout(() => {
            document.querySelector('input.imoji-picker--search-input').value = '';
            document.querySelector('.imoji-picker').classList.remove('searching');
            setTimeout(() => Imoji.render(Imoji.emojis), 250 );
        }, 250);
    };

    this.scrollToCategory = (category) => {
        let element = document.querySelector( '.imoji-picker--emojis #imoji-categories--' + category );

        if ( element.length > 0 ) {
            scrollTo( document.querySelector('.imoji-picker--emojis'), element.offset.top, 1000 );
        };
    };

};




function scrollTo( element, to, duration ) {
    let start = element.scrollTop - emojis.offset.top,
        change = to - start,
        currentTime = 0,
        increment = 20;

    let animateScroll = function() {
        currentTime += increment;
        var val = Math.easeInOutQuad( currentTime, start, change, duration );
        element.scrollTop = val;
        if ( currentTime < duration ) {
            setTimeout( animateScroll, increment );
        }
    };
    animateScroll();
}

Math.easeInOutQuad = (t, b, c, d) => {
    t /= d/2;
        if (t < 1) return c/2*t*t + b;
        t--;
        return -c/2 * (t*(t-2) - 1) + b;
};
