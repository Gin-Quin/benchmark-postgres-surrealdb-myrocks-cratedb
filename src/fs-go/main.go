package main

import (
	"fmt"
	"time"
	"os"
	"math/rand"
)

var letters = []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ")

func randomSequence(length int) string {
	b := make([]rune, length)
	for i := range b {
		 b[i] = letters[rand.Intn(len(letters))]
	}
	return string(b)
}

func main() {
	// indexeds is an array of 2048 random strings of length 32
	var data [2048][]byte
	var paths [2048]string

	for i := 0; i < 2048; i++ {
		data[i] = []byte(randomSequence(1024))
		paths[i] = "files/" + randomSequence(32)
		// fmt.Println(paths[i])
	}


	// start timer
	var now = time.Now()
	
	for index := 0; index < 2048; index++ {
		file, err := os.Create(paths[index])
		if err != nil {
			panic(err)
		}
		file.Write(data[index])
		file.Close()
	}

	// end and print timer
	fmt.Println(time.Since(now))
}