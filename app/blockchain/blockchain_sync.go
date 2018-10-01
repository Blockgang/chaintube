package main

import (
	"database/sql"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	_ "github.com/go-sql-driver/mysql"
)

var query = `{
  "v": 2,
  "e": { "out.b1": "hex"  },
  "q": {
    "find": {
      "out.b1": "e901",
      "out.b0": {
        "op": 106
      },
      "blk.i": {
        "$gte" : 550000
      }

    },
    "project": {
      "out.b1": 1,
      "out.s2": 1,
      "out.s3": 1,
      "out.s4": 1,
      "tx.h": 1,
			"blk.t": 1,
      "_id": 0
    }
  }
}`

type Query struct {
	Unconfirmed []Transaction `json:"unconfirmed"`
	Confirmed   []Transaction `json:"confirmed"`
}

type Transaction struct {
	Tx  Id    `json:"tx"`
	Out []Sub `json:"out"`
	Blk Ts    `json:"blk"`
}

type Sub struct {
	B1 string `json:"b1"`
	S2 string `json:"s2"`
	S3 string `json:"s3"`
	S4 string `json:"s4"`
}

type Ts struct {
	T int64 `json:"t"`
}

type Id struct {
	H string `json:"h"`
}

func insertIntoMysql(TxId string, prefix string, hash string, data_type string, title string, blocktimestamp int64) bool {
	fmt.Println(TxId, prefix, hash, data_type, title, blocktimestamp)
	//Mysql
	db, err := sql.Open("mysql", "root:123456@tcp(127.0.0.1:3306)/theca")
	if err != nil {
		return false
	}
	defer db.Close()

	sql_query := "INSERT INTO opreturn VALUES(?,?,?,?,?,?)"
	insert, err := db.Prepare(sql_query)
	defer insert.Close()

	_, err = insert.Query(TxId, prefix, hash, data_type, title, blocktimestamp)
	if err != nil {
		return true
	}
	return true
}

func main() {
	var q Query
	//url encoded query : blocksize greater than 550'000
	b64_query := base64.StdEncoding.EncodeToString([]byte(query))
	url := "https://bitdb.network/q/" + b64_query
	client := &http.Client{}
	req, _ := http.NewRequest("GET", url, nil)
	req.Header.Set("key", "qz6qzfpttw44eqzqz8t2k26qxswhff79ng40pp2m44")
	res, _ := client.Do(req)

	body, err := ioutil.ReadAll(res.Body)
	if err != nil {
		log.Fatalln(err)
	}

	json.Unmarshal(body, &q)

	for i := range q.Confirmed {
		TxId := q.Confirmed[i].Tx.H
		txOuts := q.Confirmed[i].Out
		BlockTimestamp := q.Confirmed[i].Blk.T
		var Prefix string
		var Hash string
		var Datatype string
		var Title string
		for a := range txOuts {
			if txOuts[a].B1 == "e901" {
				Prefix = txOuts[a].B1
				Hash = txOuts[a].S2
				Datatype = txOuts[a].S3
				Title = txOuts[a].S4
			}
		}

		if len(Prefix) != 0 && len(Hash) > 20 && len(Datatype) > 2 {
			fmt.Println(TxId, Prefix, Hash, Datatype, Title, BlockTimestamp)
			insert := insertIntoMysql(TxId, Prefix, Hash, Datatype, Title, BlockTimestamp)
			if insert != true {
				fmt.Println("Insert failed!")
			} else {
				fmt.Println("Insert OK")
			}
		}
	}

}
