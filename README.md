# CHAINTUBE.CASH

Media Plattform basierend auf Bitcoin Cash (OP_RETURN)

* https://blockgang.github.io/chaintube
* https://instant.io/
* https://icons8.com/icon/set/error/all
* https://github.com/unwriter/datacash
* https://docs.bitdb.network/docs/quickstart

# Installation
 go get -u github.com/go-sql-driver/mysql

# Prefix

Prefix: 0xe901 (Main)
```

# OP_RETURN 0xe901 <magnet/ipfs-hash> <data-type> <titel>

OP_RETURN (PD1)0xe901  (PD2)magnet:?xt=urn:btih:678d1a0744863813bd11e12c473e0a2ab3d07f27 (PD3)mp4 (PD4)DAS IST DER TITEL DES VIEOS

```

Prefix: 0xe902 (Description)
```
# OP_RETURN 0xe902 <hash>|<chunk-nr>|<data>

OP_RETURN (PD1)0xe902 (PD2)magnet:?xt=urn:btih:678d1a0744863813bd11e12c473e0a2ab3d07f27 (PD3)0 (PD4)Erster Teil der Beschreibung

OP_RETURN (PD1)0xe902 (PD2)magnet:?xt=urn:btih:678d1a0744863813bd11e12c473e0a2ab3d07f27 (PD3)1 (PD4)und das ist der 2. Teil der Beschreibung
...
```

Prefix: 0xe903 (Like + Tip)
```
# OP_RETURN 0xe903 <magnet-hash>

OP_RETURN 0xe902 08ada5a7a6183aae1e09d831df6748d566095a10
```

Prefix: 0xe904 (Dislike)
```
# OP_RETURN 0xe904 <magnet-hash>

OP_RETURN 0xe904 08ada5a7a6183aae1e09d831df6748d566095a10
```

Prefix: 0xe905 (Comment)
```
# OP_RETURN 0xe905 <magnet-hash>|<comment>

OP_RETURN 0xe905 08ada5a7a6183aae1e09d831df6748d566095a10|Bestes Video überhaupt =)...
```

MEMO-Example:
```
Action 	Prefix 	Values 	Status 	Example
Set name 	0x6d01 	name(217) 	Implemented 	
Post memo 	0x6d02 	message(217) 	Implemented 	
Reply to memo 	0x6d03 	txhash(30), message(184) 	Implemented 	
Like / tip memo 	0x6d04 	txhash(30) 	Implemented 	
Set profile text 	0x6d05 	message(217) 	Implemented 	
Follow user 	0x6d06 	address(35) 	Implemented 	
Unfollow user 	0x6d07 	address(35) 	Implemented 	
Set profile picture 	0x6d0a 	url(217) 	Implemented 	
Repost memo 	0x6d0b 	txhash(30), message(184) 	Planned 	-
Post topic message 	0x6d0c 	topic_name(variable), message(214 - topic length) 	Implemented 	
Topic follow 	0x6d0d 	topic_name(variable) 	Implemented 	
Topic unfollow 	0x6d0e 	topic_name(variable) 	Implemented 	
Create poll 	0x6d10 	poll_type(1), option_count(1), question(209) 	Implemented 	
Add poll option 	0x6d13 	poll_txhash(30), option(184) 	Implemented 	
Poll vote 	0x6d14 	poll_txhash(30), comment(184) 	Implemented 	
Send money 	0x6d24 	message(217) 	Planned
```

## TODO

* webtorrent performance
* webtorrent bug fix ( videos werden nicht immer angezeigt)
