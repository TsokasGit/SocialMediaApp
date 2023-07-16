import { useState, React, useEffect } from "react";
import { Pressable, Text, View, Image, FlatList, KeyboardAvoidingView, TextInput } from 'react-native';
import { FIREBASE_AUTH } from "../FirebaseConfig";
import { FIRESTORE } from "../FirebaseConfig";
import {  collection, query, getDocs, where, setDoc, doc, serverTimestamp, orderBy } from "firebase/firestore";
import { useRoute } from '@react-navigation/native';

export default function PrivateMessages({ navigation}) {
    const route = useRoute();
    const { userId } = route.params;
    const db = FIRESTORE;
    const auth = FIREBASE_AUTH;
    const messagesRef = collection(db, "PrivateMessages");
    const [messageValue, setMessageValue] = useState("");
    const [privateMSG, setPrivateMSG] = useState([]);


    // Text input handling
    const handleInputChangeMessage = (message) => {
      setMessageValue(message);
    }

    // Send the message
    const SubmitButton = async () => {
      await setDoc(doc(messagesRef), {message: messageValue,
        user1: auth.currentUser.uid,
        user2: userId,
        createdAt: serverTimestamp(),
        sender: auth.currentUser.displayName,
        senderProfile: auth.currentUser.photoURL
    });
    setMessageValue("");
    }

    // Fetching the private messages from the database.
    useEffect(() => {
      const fetchPrivateMessages = async () => {
        const q = query(
          collection(db, "PrivateMessages"),orderBy("createdAt"),
          where("user1", "in", [auth.currentUser.uid, userId]),
          where("user2", "in", [auth.currentUser.uid, userId])
        );
        const querySnapshot = await getDocs(q);
        let msgs = [];
        querySnapshot.forEach((doc) => {
          msgs.push(doc.data());
        });
        setPrivateMSG(msgs);
      };
    
      fetchPrivateMessages();
    }, [privateMSG]);

    // HTML
      return (
        <>
        <View style={{ paddingHorizontal: 20, justifyContent: "space-between", flexDirection: "row", paddingVertical: 50 , alignItems: "center", backgroundColor: "#000000", borderBottomWidth: 6, borderTopWidth: 6, shadowColor: "#000", shadowOffset: {width:0, height: 15}, shadowOpacity: 0.5,shadowRadius: 12}}>
        <Pressable onPress={() => navigation.navigate("Friendslist")}><Image style={{alignSelf: "center", height: 30, width:75}} source={require("../assets/back.png")}/></Pressable>
        <Image style={{alignSelf: "center", height: 30, width:75, marginRight: 40}} source={require("../assets/Logo.png")}/>
        <Pressable><Image style={{alignSelf: "center", height: 31, width:31}}/></Pressable>
        </View>
        <View style={{flex: 1, backgroundColor: "#000010"}}>
          {privateMSG.length > 0 && (
            <FlatList ref={(ref) => {this.flatListRef = ref;}} onContentSizeChange={() => {this.flatListRef.scrollToEnd({animated: true})}} data={privateMSG} renderItem={({item}) => (
          <View style={{alignItems: item.sender === auth.currentUser.displayName ? "flex-end" : "flex-start"}}>
            <Text style={{color: "white", alignSelf: "center", padding: 20}}>{item.sender}</Text>
          <View style={{width: "70%",padding: 20,borderWidth:5, borderRadius:25, backgroundColor: "#299999", flexDirection: "row", alignItems: "center", paddingHorizontal: 10}}>
            <Image style={{height: 50, width:50, borderRadius: 25}} source={{uri: item.senderProfile}}/>
            <Text style={{color: "white", paddingHorizontal: 15, width: "80%"}}>{item.message}</Text>
          </View>
          <Text style={{color: "white", paddingHorizontal: 20}}>{item.createdAt ? item.createdAt.toDate().toLocaleString() : ''}</Text>
          </View>
          )} 
          keyExtractor={(item) => item.createdAt}>
          </FlatList>
          )}
        </View>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={{  backgroundColor: "black", padding: 10, justifyContent: "space-between", alignItems: "flex-end", flexDirection: "row", shadowColor: "#000", shadowOffset: {width:0, height: 15}, shadowOpacity: 0.5,shadowRadius: 12}}>
            <TextInput placeholderTextColor={"white"} value={messageValue} onChangeText={handleInputChangeMessage} style={{padding:10, width: "80%", color: "white"}} id="MessageInput" placeholder="Γράψε το μήνυμα σου εδώ..."></TextInput>
            <Pressable></Pressable>
            <Pressable onPress={SubmitButton} id="submitID" style={{backgroundColor: "white",borderWidth: 2, padding: 10, borderRadius: 20, alignSelf:"center", borderColor: "gray"}}><Text style={{}}>Στείλτο!</Text></Pressable>
          </View>
          <View style={{backgroundColor: "#000000", height: 100, borderTopWidth: 6, borderBottomWidth: 6}}></View>
        </KeyboardAvoidingView>
        </>
      );
    }