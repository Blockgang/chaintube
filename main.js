function send(){
  var pkey = document.getElementById('pkey').value
  var title = document.getElementById('title').value
  var hash = document.getElementById('hash').value
  var prefix = "0xe901"
  var type = "0001"
  var raw_data = hash + "|" + type + "|" + title
  console.log(raw_data);
  datacash.send({
    data: [prefix, raw_data],
    cash: { key: pkey }
  });
}


function check_data(data){
  var regex = /([a-z0-9]{20,50})\|([0-9]{4})\|(.*$)/g
  var match = regex.exec(data)
  var title = false, hash = false, type = false
  if(match){
    hash = match[1];
    type = match[2];
    title = match[3];
    console.log("Hash: " + hash + "Type: " + type + " Titel: " +  title);
  }
  return [hash,title,type]
}

function play(hash,title,sender){
  console.log(hash);
  console.log(title);
  download_torrent(hash,title,sender);
}


function bitdb_get_magnetlinks(limit) {
  var search_string = document.getElementById('search').value
  var query = {
    request: {
      encoding: {
        b1: "hex"
      },
      find: {
        b1: { "$in": ["e901"] },
        s2: {
          "$regex": search_string, "$options": "i"
        }
        // b2: search_string,
        // 'senders.a': "qpy3cc67n3j9rpr8c3yx3lv0qc9k2kmfyud9e485w2"
      },
      project: {
        b0:1 ,b1: 1, s2: 1, tx: 1, block_index: 1, _id: 0, senders: 1
      },
      limit: limit
    },
    response: {
      encoding: {
        b1: "hex"
      }
    }
  };
  var b64 = btoa(JSON.stringify(query));
  var url = "https://bitdb.network/v2/q/" + b64;

  var header = {
    headers: { key: "qz6qzfpttw44eqzqz8t2k26qxswhff79ng40pp2m44" }
  };

  fetch(url, header).then(function(r) {
    return r.json()
  }).then(function(r) {

    console.log(r)
    document.getElementById('bitdb_output').innerHTML = ""

    document.getElementById('bitdb_output_table').style.display = "table-row"


    if(r['confirmed'].length != 0){
      var tr = document.createElement('tr');
      for(i in r['confirmed']){
        var tx = r['confirmed'][i]
        list_tx_results(tx,true);
      };
    };

    if(r['unconfirmed'].length != 0){
      var tr = document.createElement('tr');
      for(i in r['unconfirmed']){
        var tx = r['unconfirmed'][i]
        list_tx_results(tx,false);
      };
    };
  })
};

function list_tx_results(tx,confirmed){
  var tr = document.createElement('tr');
  var td_txid = document.createElement('td');
  var td_6a_magnethash = document.createElement('td');
  var td_6a_title = document.createElement('td');
  var td_6a_type = document.createElement('td');
  var td_sender = document.createElement('td');
  var td_blockheight = document.createElement('td');
  var td_play = document.createElement('td');

  td_txid.innerHTML = "<a href='https://blockchair.com/bitcoin-cash/transaction/"+ tx.tx +"'>Tx</a>";
  console.log(tx)
  td_sender.innerHTML = tx.senders[0].a
  td_blockheight.innerHTML = (confirmed) ? (tx.block_index) : ("unconfirmed")

  data = check_data(tx.s2);
  if (data[0]){
    td_6a_magnethash.innerHTML = data[0];
    td_6a_title.innerHTML = data[1];
    td_6a_type.innerHTML = data[2];

    input_data = '"' + data[0] + '","' + data[1] + '","' + tx.senders[0].a + '"'
    td_play.innerHTML = "<button class='play_button' onclick='play(" + input_data + ");'><img src='icons/icons8-play-button-48.png'></button>";
  }else{
    td_6a_magnethash.innerHTML = "-";
    td_6a_title.innerHTML = "-";
    td_6a_type.innerHTML = "-";
    td_play.innerHTML = "<img src='icons/icons8-close-window-48.png'>";

  }

  tr.appendChild(td_play);
  tr.appendChild(td_txid);
  tr.appendChild(td_6a_title);
  tr.appendChild(td_6a_type);
  tr.appendChild(td_6a_magnethash);
  tr.appendChild(td_sender);
  tr.appendChild(td_blockheight);

  document.getElementById('bitdb_output').appendChild(tr);
};

function get_video_data(hash,title,sender){
  // Insert Title
  document.getElementById('video_title').innerHTML = title

  var query = {
    request: {
      encoding: {
        b1: "hex"
      },
      find: {
        b1: { "$in": ["e902"] },
        s2: {
          "$regex": hash, "$options": "i"
        },
        'senders.a' :  {
          "$in": [sender]
        }
      },
      project: {
        b0:1 ,b1: 1, s2: 1, tx: 1, block_index: 1, _id: 0, senders: 1
      },
      limit: 10
    },
    response: {
      encoding: {
        b1: "hex"
      }
    }
  };
  var b64 = btoa(JSON.stringify(query));
  var url = "https://bitdb.network/v2/q/" + b64;

  var header = {
    headers: { key: "qz6qzfpttw44eqzqz8t2k26qxswhff79ng40pp2m44" }
  };

  fetch(url, header).then(function(r) {
    return r.json()
  }).then(function(r) {

    for(i in r['confirmed']){
      var tx = r['confirmed'][i];
      console.log(tx.s2);
      var p = document.createElement('p');
      p.innerHTML = tx.s2
      document.getElementById('video_description').appendChild(p)
    };

  })
}

function download_torrent(hash,title,sender){
  var torrentId = "magnet:?xt=urn:btih:" + hash + "&tr=udp://explodie.org:6969&tr=udp://tracker.coppersurfer.tk:6969&tr=udp://tracker.empire-js.us:1337&tr=udp://tracker.leechers-paradise.org:6969&tr=udp://tracker.opentrackr.org:1337&tr=wss://tracker.openwebtorrent.com"
  // var torrentId = "magnet:?xt=urn:btih:" + hash + "&tr=udp://explodie.org:6969&tr=udp://tracker.coppersurfer.tk:6969&tr=udp://tracker.empire-js.us:1337&tr=udp://tracker.leechers-paradise.org:6969&tr=udp://tracker.opentrackr.org:1337&tr=wss://tracker.openwebtorrent.com&as=https://seed28.bitchute.com/ObwN8WgxyInB/9mZvVimJmlKD.mp4&xs=https://www.bitchute.com/torrent/ObwN8WgxyInB/9mZvVimJmlKD.webtorrent"

  var client = new WebTorrent()

  // HTML elements
  var $body = document.body
  var $progressBar = document.querySelector('#progressBar')
  var $numPeers = document.querySelector('#numPeers')
  var $downloaded = document.querySelector('#downloaded')
  var $total = document.querySelector('#total')
  var $remaining = document.querySelector('#remaining')
  var $uploadSpeed = document.querySelector('#uploadSpeed')
  var $downloadSpeed = document.querySelector('#downloadSpeed')

  // Download the torrent
  client.add(torrentId, function (torrent) {

    // insert data
    document.getElementById('torrentLink').innerHTML = torrentId
    // Video Data from Blockchain
    get_video_data(hash,title,sender);

    // show divs
    document.getElementById('status').style.display = "block";
    document.getElementById('progressBar').style.display = "block";

    // Torrents can contain many files. Let's use the .mp4 file
    var file = torrent.files.find(function (file) {
      return file.name.endsWith('.mp4')
    })

    // Stream the file in the browser
    file.appendTo('#output')

    // Trigger statistics refresh
    torrent.on('done', onDone)
    setInterval(onProgress, 500)
    onProgress()

    // Statistics
    function onProgress () {
      // Peers
      $numPeers.innerHTML = torrent.numPeers + (torrent.numPeers === 1 ? ' peer' : ' peers')

      // Progress
      var percent = Math.round(torrent.progress * 100 * 100) / 100
      $progressBar.style.width = percent + '%'
      $downloaded.innerHTML = prettyBytes(torrent.downloaded)
      $total.innerHTML = prettyBytes(torrent.length)

      // Remaining time
      var remaining
      if (torrent.done) {
        remaining = 'Done.'
      } else {
        remaining = moment.duration(torrent.timeRemaining / 1000, 'seconds').humanize()
        remaining = remaining[0].toUpperCase() + remaining.substring(1) + ' remaining.'
      }
      $remaining.innerHTML = remaining

      // Speed rates
      $downloadSpeed.innerHTML = prettyBytes(torrent.downloadSpeed) + '/s'
      $uploadSpeed.innerHTML = prettyBytes(torrent.uploadSpeed) + '/s'
    }
    function onDone () {
      $body.className += ' is-seed'
      onProgress()
    }
  })
}

// Human readable bytes util
function prettyBytes(num) {
  var exponent, unit, neg = num < 0, units = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  if (neg) num = -num
  if (num < 1) return (neg ? '-' : '') + num + ' B'
  exponent = Math.min(Math.floor(Math.log(num) / Math.log(1000)), units.length - 1)
  num = Number((num / Math.pow(1000, exponent)).toFixed(2))
  unit = units[exponent]
  return (neg ? '-' : '') + num + ' ' + unit
}
