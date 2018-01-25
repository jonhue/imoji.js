/**!
 * @fileOverview Imoji.js - A sleek & responsive emoji input
 * @version 1.0.0
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
var Imoji = new function() {

    this.element = $('.imoji-picker');
    this.input = null;
    this.emojis = null;

    this.init = function(options) {

        var defaults = {
            emojis: 'emoji.json',
            input: null
        };
        options = $.extend( defaults, options );

        var emojis = require(options.emojis);
        Imoji.emojis = {};
        var i = 0;
        while ( i++ < emojis.length ) {
            var key = emojis[i].category;
            if ( typeof Imoji.emojis[key] == 'undefined' )
                Imoji.emojis[key] = [];
            Imoji.emojis[key].push(emojis[i]);
        };

        Imoji.input = options.input;
        Imoji.create();

        $('[data-imoji]').click(function() {
            if ( Imoji.input != false )
                Imoji.input = $(this).closest('input');
            Imoji.open();
        });

        $('.imoji-picker--emojis-emoji').click(function() {
            $.each( Imoji.emojis, function( category, emojis ) {
                var emoji = $.grep( emojis, function(e) {
                    return e.aliases[0] == $(this).attr('id').replace( 'imoji-emojis--', '' );
                });
            });
            Imoji.select(emoji);
        });

        $(document).on( 'imoji:select', function( event, emoji ) {
            if ( $(Imoji.input).length > 0 )
                Imoji.updateInput(emoji.emoji);
        });

    };

    this.create = function() {
        var wrapper = $('.imoji-picker--emojis');
        var categoriesWrapper = $('.imoji-picker--categories');

        $.each( Imoji.emojis, function( category, emojis ) {
            categoriesWrapper.append('<div class="imoji-picker--categories-category imoji-icon" id="imoji-categories-footer--' + category + '">' + emojis[0].emoji + '</div>');

            wrapper.append('<div class="imoji-picker--emojis-category" id="imoji-categories--' + category + '"><h6>' + category + '</h6></div>');
            var categoryWrapper = wrapper.find( '#imoji-categories--' + category );
            $.each( emojis, function( k, emoji ) {
                categoryWrapper.append('<div class="imoji-picker--emojis-emoji imoji-icon imoji-icon--sm" id="imoji-emojis--' + emoji.aliases[0] + '">' + emoji.emoji + '</div>');
            });
        });
    };

    this.open = function() {
        $(document).trigger('imoji:open');
        if ( $(Imoji.input).length > 0 )
            $(Imoji.element).focus();
        $('body').addClass('imoji--open');
    };

    this.close = function() {
        $(document).trigger('imoji:close');
        $('body').removeClass('imoji--open');
    };

    this.select = function(emoji) {
        $(document).trigger( 'imoji:select', [emoji] );
    };

    this.updateInput = function(emoji) {
        $(Imoji.input).val( $(Imoji.input).val() + emoji );
    };

};
