function send(){
  var pkey = document.getElementById('pkey').value
  var title = document.getElementById('title').value
  var hash = document.getElementById('hash').value
  var prefix = "0xe901"
  var type = "0001"
  // var hash = "ca2d7f92751d7f041c811ad0fb4aac1238cbf775"
  // var title = "BEETHOVEN - SONATA CLARO DE LUNA"
  var raw_data = hash + "|" + type + "|" + title
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

function play(hash,title){
  console.log(hash);
  console.log(title);
  download_torrent(hash,title);
}


function bitdb_get_magnetlinks(limit) {
  console.log(limit);
  var query = {
    request: {
      encoding: { b1: "hex" },
      find: {
        b1: { "$in": ["e901"] }
      },
      project: {
        b0:1 ,b1: 1, b2: 1, tx: 1, block_index: 1, _id: 0
      },
      limit: limit
    },
    response: {
      encoding: {
        b1: "hex",
        b2: "utf8"
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

    var li = document.createElement('li');
    li.innerHTML = "CONFIRMED:"
    document.getElementById('bitdb_output').appendChild(li);

    for(i in r['confirmed']){
      var tx = r['confirmed'][i]
      var li = document.createElement('li');
      li.innerHTML = "<a href='https://blockchair.com/bitcoin-cash/transaction/"+ tx.tx +"'>Blockexplorer</a>==> OP_RETURN: " + JSON.stringify(tx.b2);
      data = check_data(tx.b2);
      if (data[0]){
        input_data = '"' + data[0] + '","' + data[1] + '"'
        li.innerHTML += "<button onclick='play(" + input_data + ");'>Play</button>";
      }
      console.log("Test: " + data);
      document.getElementById('bitdb_output').appendChild(li);
    };

    var li = document.createElement('li');
    li.innerHTML = "UNCONFIRMED:"
    document.getElementById('bitdb_output').appendChild(li);

    for(i in r['unconfirmed']){
      var tx = r['unconfirmed'][i]
      var li = document.createElement('li');
      li.innerHTML = "<a href='https://blockchair.com/bitcoin-cash/transaction/"+ tx.tx +"'>Blockexplorer</a>==> OP_RETURN: " + JSON.stringify(tx.b2);
      data = check_data(tx.b2);
      if (data[0]){
        input_data = '"' + data[0] + '","' + data[1] + '"'
        li.innerHTML += "<button onclick='play(" + input_data + ");'>Play</button>";
      }
      console.log("Test: " + data);
      document.getElementById('bitdb_output').appendChild(li);
    };
  })
};


function download_torrent(hash,title){
  var torrentId = "magnet:?xt=urn:btih:" + hash + "&tr=udp://explodie.org:6969&tr=udp://tracker.coppersurfer.tk:6969&tr=udp://tracker.empire-js.us:1337&tr=udp://tracker.leechers-paradise.org:6969&tr=udp://tracker.opentrackr.org:1337&tr=wss://tracker.openwebtorrent.com"

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
