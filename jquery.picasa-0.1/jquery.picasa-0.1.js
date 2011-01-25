/**
 * Picasa
 *
 * Integração com o Picasaweb via API
 *
 * @package     Picasa
 * @author      Thiago Paes <mrprompt@gmail.com>
 * @version     0.1
 * @license     GPL v2
 */
var Picasa = {
    host:           'https://picasaweb.google.com/data/feed/api/user/',
    container:      '.picasa',
    usuario:        'mrprompt',
    albumThumbsize: '144c',
    fotoThumbsize:  '288c',
    callBack:       "Picasa.mostraFoto()",

    mostraFoto: function()
    {
        $('.foto').click(function(event) {
            event.preventDefault();

            $('<div/>').attr('class', 'fotoView').appendTo(Picasa.container);
            $('<img/>').attr('src', $(this).attr('href'))
                       .appendTo('.fotoView');

            $('.fotoView').click(function(e) {
                e.preventDefault();

                $('.fotoView').hide('slow');
                $('.fotoView').remove();

                return false;
            });

            return false;
        });
    },

    abrirAlbum: function(albumId)
    {
        $('.albuns').slideUp('slow');

        $('<div/>').attr('class', 'fotos')
                   .appendTo(this.container);

        $('<div/>').attr('class', 'botao')
                   .html('Voltar')
                   .appendTo('.fotos');

        $('.botao').click(function(event) {
            event.preventDefault();

            $('.fotos').slideUp('slow', function() {
                $('.loading').remove();
                $('.botao').remove();
                $('.fotos').remove();
                $('.fotoView').remove();

                $('.albuns').slideDown('slow');
            });

            return false;
        });

        var url = this.host + this.usuario + "/albumid/" + albumId
                +  "?kind=photo&thumbsize=" + this.fotoThumbsize
                +  "&access=public&alt=json&callback=?";

        $.getJSON(url, function(data){
            $('<h1/>').html(data.feed.title.$t)
                      .appendTo('.fotos');

            for (var i = 0; i < data.feed.entry.length; i++) {
                var pic = data.feed.entry[i];

                $("<a/>").attr('class', 'foto')
                         .attr("id", "foto_" + i)
                         .attr("href", pic.media$group.media$content[0].url)
                         .attr("title", pic.title.$t)
                         .attr("rel", 'group')
                         .appendTo(".fotos");

                $("<img/>").attr("src", pic.media$group.media$thumbnail[0].url)
                           .attr("alt", pic.summary.$t)
                           .appendTo("#foto_" + i);

                $('<b>' + pic.title.$t + '</b>').appendTo("#foto_" + i);
            }

            eval(Picasa.callBack);
        });
    },

    listarAlbuns: function(usuario, container)
    {
        if (usuario !== undefined) {
            this.usuario = usuario;
        }

        if (container !== undefined) {
            this.container = container;
        }

        var url = this.host + this.usuario
                + "?kind=album&thumbsize="  + this.albumThumbsize
                + "&access=public&showall=true&alt=json&callback=?";

        $('<div/>').attr('class', 'albuns')
                   .appendTo(this.container);

        $.getJSON(url, function(data){
            $('<h1/>').html(data.feed.title.$t)
                      .appendTo('.albuns');

            for (var i = 0; i < data.feed.entry.length; i++) {
                var pic     = data.feed.entry[i];
                var albumId = pic.id.$t.replace(this.host + '/albumid/', '')
                                       .replace(/[^0-9]+/g, '');

                $("<a/>").attr('class', 'album')
                         .attr('href', 'javascript:;')
                         .attr("id", "album_" + i)
                         .attr("rel", albumId)
                         .appendTo(".albuns");

                $("<img/>").attr("src", pic.media$group.media$thumbnail[0].url)
                           .attr("alt", pic.summary.$t)
                           .appendTo("#album_" + i);

                $('<b>' + pic.title.$t + '</b>').appendTo("#album_" + i);
            }

            $('.album').click(function(event) {
                event.preventDefault();

                Picasa.abrirAlbum($(this).attr('rel'));

                return false;
            });
        });
    }
}
