# chaintube
video platform basierend auf BCH OP_RETURN


https://blockgang.github.io/chaintube

Prefix: 0xe902

"OP_RETURN 0xe902 <magnet-hash>|<titel>"
  
...

OP_RETURN 0xe902 b9628c4ab9b595f72f280b90c4fd093d|DAS IST DER TITEL DES VIEOS



"OP_RETURN 0xe903 <hash(<magnet-hash> + <titel>)>|<chunk-nr>|<data>"
  
...

OP_RETURN 0xe903 68b329da9893e34099c7d8ad5cb9c940|0|das ist der erste teil

OP_RETURN 0xe903 68b329da9893e34099c7d8ad5cb9c940|1|und das der 2 teil der beschreibung



TODOs:

webtorrent performance

webtorrent bug fix ( videos werden nicht immer angezeigt)
