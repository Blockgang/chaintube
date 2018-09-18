# chaintube
video platform basierend auf BCH OP_RETURN


https://blockgang.github.io/chaintube

Prefix: 0xe901 (Main)
```

# OP_RETURN 0xe901 <magnet-hash>|type|<titel>

OP_RETURN 0xe901 08ada5a7a6183aae1e09d831df6748d566095a10|mp4|DAS IST DER TITEL DES VIEOS

```

Prefix: 0xe902 (Description)
```
# OP_RETURN 0xe902 <magnet-hash>|<chunk-nr>|<data>

OP_RETURN 0xe902 08ada5a7a6183aae1e09d831df6748d566095a10|0|Erster Teil der Beschreibung

OP_RETURN 0xe902 08ada5a7a6183aae1e09d831df6748d566095a10|1|und das ist der 2. Teil der Beschreibung
...
```

Prefix: 0xe903 (Like)
```
# OP_RETURN 0xe903 <magnet-hash>|<comment>

OP_RETURN 0xe902 08ada5a7a6183aae1e09d831df6748d566095a10|Ich mag das Video!
```

Prefix: 0xe904 (Dislike)
```
# OP_RETURN 0xe904 <magnet-hash>|<comment>

OP_RETURN 0xe904 08ada5a7a6183aae1e09d831df6748d566095a10|Schlechtes Video... :(
```


TODOs:

webtorrent performance

webtorrent bug fix ( videos werden nicht immer angezeigt)
