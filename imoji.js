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

    this.input = null;
    this.emojis = {};

    this.init = function(options) {

        var defaults = {
            emojis: 'https://raw.githubusercontent.com/github/gemoji/master/db/emoji.json',
            input: null
        };
        options = $.extend( defaults, options );

        Imoji.input = options.input;

        $.getJSON( options.emojis, function(data) {
            var i = 0;
            while ( i++ < data.length ) {
                if ( typeof data[i] != 'undefined' && data[i].hasOwnProperty('category') ) {
                    var key = data[i].category;
                    if ( typeof Imoji.emojis[key] == 'undefined' )
                        Imoji.emojis[key] = [];
                    Imoji.emojis[key].push(data[i]);
                };
            };
            Imoji.create();
        });

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

        $('.imoji-picker--search-trigger').click(function() {
            if ($('.imoji-picker').hasClass('searching')) {
                Imoji.hideSearch();
            } else {
                Imoji.showSearch();
            };
        });

        $('.imoji-picker--delete').click(function() {
            Imoji.deleteFromInput();
        });

        $('.imoji-picker--search-delete').click(function() {
            $('input.imoji-picker--search-input').val('');
        });

        $(document).on( 'imoji:select', function( event, emoji ) {
            if ( $(Imoji.input).length > 0 )
                Imoji.updateInput(emoji.emoji);
        });

    };

    this.create = function() {
        if ( $(Imoji.input).length > 0 ) {
            $('.imoji-picker--delete').css( 'display', 'block' );
        } else {
            $('.imoji-picker--delete').css( 'display', 'none' );
        };

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
            $('.imoji-picker').focus();
        $('body').addClass('imoji--open');
    };

    this.close = function() {
        $(document).trigger('imoji:close');
        $('body').removeClass('imoji--open');
    };

    this.select = function(emoji) {
        var e = jQuery.Event('imoji:select');
        e.data = {
            emoji: emoji,
        };
        $(document).trigger(e);
    };

    this.updateInput = function(emoji) {
        $(Imoji.input).val( $(Imoji.input).val() + emoji );
    };

    this.deleteFromInput = function() {
        $(Imoji.input).val( $(Imoji.input).val().slice( 0, -1 ) );
    };

    this.showSearch = function() {
        $('.imoji-picker--emojis').animate( { 'marginTop': '50px' }, 250, function() {
            $('.imoji-picker').addClass('searching');
            $('.imoji-picker--emojis').css( 'marginTop', '0' );
        });
    };

    this.hideSearch = function() {
        $('.imoji-picker').removeClass('searching');
        $('.imoji-picker--emojis').css( 'marginTop', '50px' );
        $('.imoji-picker--emojis').animate( { 'marginTop': '0' }, 250 );
    };

};
