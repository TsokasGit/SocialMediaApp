import { useState, React, useEffect } from "react";
import { Pressable, Text, View, Image } from 'react-native';
import { FlatList } from "react-native-gesture-handler";
import { FIRESTORE } from "../FirebaseConfig";
import {  collection, orderBy, query, onSnapshot } from "firebase/firestore";

export default function Postpage({navigation}) {


  const db = FIRESTORE;
  const messagesRef = collection(db, "posts");
  const [posts, setPosts] = useState([]);
  const AddPost = async () => {
    navigation.navigate("Post");
  }

  useEffect(() => {
    const msgQuery = query(messagesRef, orderBy("createdAt", "desc")); // Change order direction to "desc"
    const unsubscribe = onSnapshot(msgQuery, (snapshot) => {
      const postsData = snapshot.docs.map((doc) => doc.data());
      setPosts(postsData);
    });
  
    return () => unsubscribe();
  }, []);

  // HTML
  return (
    <>
    <View style={{ paddingHorizontal: 20, justifyContent: "space-between", flexDirection: "row", paddingVertical: 50 , alignItems: "center", backgroundColor: "#000000", borderBottomWidth: 6, borderTopWidth: 6, shadowColor: "#000", shadowOffset: {width:0, height: 15}, shadowOpacity: 0.5,shadowRadius: 12}}>
        <Pressable onPress={() => navigation.navigate("Homepage")}><Image style={{alignSelf: "center", height: 30, width:75}} source={require("../assets/back.png")}/></Pressable>
        <Image style={{alignSelf: "center", height: 30, width:75, marginRight: 40}} source={require("../assets/Logo.png")}/>
        <Pressable onPress={AddPost}><Image style={{alignSelf: "center", height: 31, width:31}} source={require("../assets/Cross.png")}/></Pressable>
    </View>
    {posts.length > 0 && (
    <FlatList ref={(ref) => {this.flatListRef = ref;}} onContentSizeChange={() => {this.flatListRef.scrollToOffset({animated: true, offset: 0 })}} style={{backgroundColor: "#000010"}} data={posts} renderItem={({ item }) => (
      <View style={{alignItems: "center", padding: 20, borderTopColor: "#669999", borderTopWidth: 3}}>
        <View style={{flexDirection: "row", padding: 10, alignItems: "center", width: "100%"}}>
        <Image style={{height:50, width: 50, borderRadius: 25}} source={{uri: item.profilePic}}/>
        <Text style={{color: "white", padding: 10, fontWeight: 900, fontSize: 30, alignSelf: "flex-start"}}>{item.user}:</Text>
        </View>
        <Image style={{height: 400, width: 400, borderRadius: 15}} source={{uri: item.postPic}}/>
        <View style={{flexDirection: "row", width: "100%"}}>
          <Text style={{fontSize: 13,fontWeight: 600 ,color: "white", padding: 20, alignSelf: "flex-start", textAlign: "left", width: "50%"}}>{item.description}</Text>
          <View>
          <Text style={{color: "white", padding: 20, alignSelf: "flex-end", textAlign: "right", width: "100%"}}>{item.createdAt ? item.createdAt.toDate().toLocaleString() : ''}</Text>
          </View>
        </View>
      </View>)} keyExtractor={(item) => item.uniqueID}>
    </FlatList>)}
    <View style={{ paddingHorizontal: 20, justifyContent: "space-between", flexDirection: "row", paddingVertical: 15 , alignItems: "center", backgroundColor: "#000000", borderBottomWidth: 6, borderTopWidth: 6, shadowColor: "#000", shadowOffset: {width:0, height: 15}, shadowOpacity: 0.5,shadowRadius: 12}}>
        <Pressable onPress={() => navigation.navigate("Friendslist")}><Image style={{alignSelf: "center", height: 42, width:60}} source={require("../assets/Friends.png")}/></Pressable>
        <Image style={{alignSelf: "center", height: 30, width:75, marginRight: 40}}/>
        <Pressable onPress={() => navigation.navigate("MyProfile")}><Image style={{alignSelf: "center", height: 62, width:60}} source={require("../assets/MyProfile.png")}/></Pressable>
    </View>
    </>
    );
  }