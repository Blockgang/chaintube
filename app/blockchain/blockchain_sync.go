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
}

type Sub struct {
	B1 string `json:"b1"`
	S2 string `json:"s2"`
	S3 string `json:"s3"`
	S4 string `json:"s4"`
}

type Id struct {
	H string `json:"h"`
}

func insertIntoMysql(TxId string, TxB1 string, S2Hash string, S2Type string, S2Title string) bool {
	fmt.Println(TxId, TxB1, S2Hash, S2Type, S2Title)
	//Mysql
	db, err := sql.Open("mysql", "root:8drRNG8RWw9FjzeJuavbY6f9@tcp(db:3306)/theca")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	sql_query := "INSERT INTO opreturn VALUES(?,?,?,?,?)"
	insert, err := db.Prepare(sql_query)
	//insert, err := db.Query(sql_query)
	defer insert.Close()

	rows, err := insert.Query(TxId, TxB1, S2Hash, S2Type, S2Title)
	defer rows.Close()

	if err != nil {
		return false
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
		var Prefix string
		var Hash string
		var Type string
		var Title string
		for a := range txOuts {
			if txOuts[a].B1 == "e901" {
				Prefix = txOuts[a].B1
				Hash = txOuts[a].S2
				Type = txOuts[a].S3
				Title = txOuts[a].S4
			}
		}

		if len(Prefix) != 0 {
			fmt.Println(TxId, Prefix, Hash, Type, Title)
			insertIntoMysql(TxId, Prefix, Hash, Type, Title)
		}

		// re := `(\S{20,50})\|(\S{4})\|(.*)`
		// rex := regexp.MustCompile(re)
		// matches := rex.FindAllStringSubmatch(TxS2, -1)

		// if len(matches) != 0 {
		// 	var S2Hash string
		// 	var S2Type string
		// 	var S2Title string
		// 	for _, i := range matches {
		// 		S2Hash = i[1]
		// 		S2Type = i[2]
		// 		S2Title = i[3]
		// 	}
		// 	fmt.Println(TxId, TxB1, S2Hash, S2Type, S2Title)
		// 	insertIntoMysql(TxId, TxB1, S2Hash, S2Type, S2Title)
		// }
	}

}
