import { useState, React, useEffect } from "react";
import { Pressable, TextInput, Text, View, Image, KeyboardAvoidingView } from 'react-native';
import { FlatList } from "react-native-gesture-handler";
import { FIREBASE_AUTH } from "../FirebaseConfig";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FIRESTORE } from "../FirebaseConfig";
import {  collection, orderBy, query, serverTimestamp,setDoc, doc, onSnapshot } from "firebase/firestore";

export default function Homepage({navigation}) {
  
  const db = FIRESTORE;
  const auth = FIREBASE_AUTH;

  // Message variable declaration
  const messagesRef = collection(db, "messages");
  const[messageValue,setMessageValue] = useState("");
  const [messges, setMessges] = useState([]);

  // Handling the inputs
  const handleInputChangeMessage = (message) => {
    setMessageValue(message);
  }

  // Send the message
  const SubmitButton = async () => {
    await setDoc(doc(messagesRef), {text: messageValue, 
    createdAt: serverTimestamp(), 
    user: auth.currentUser.displayName,
    photoURL: auth.currentUser.photoURL});
    setMessageValue("");
  }

  // Log out the user
  const LogOut = () => {
    navigation.navigate("Login");
    AsyncStorage.setItem("email_key", "");
    AsyncStorage.setItem("pass_key", "");
  }

  useEffect(() => {
    // Messaging Logic
    const msgQuery = query(messagesRef, orderBy("createdAt"));
    const unsubscribe = onSnapshot(msgQuery, (snapshot) =>{
      let msgs = [];
      snapshot.forEach((doc) => {
        msgs.push({ ...doc.data(), id: doc.id })
      });
      setMessges(msgs);
    });


    return () => unsubscribe;
  }, [])

  // HTML
  return (
    <>
      <View style={{ borderBottomColor: "#669999", paddingHorizontal: 20, justifyContent: "space-between",flexDirection: "row",paddingVertical: 50 ,alignItems: "center", backgroundColor: "#000000", borderBottomWidth: 3, borderTopWidth: 6, shadowColor: "#000", shadowOffset: {width:0, height: 15}, shadowOpacity: 0.5,shadowRadius: 12}}>
          <Pressable onPress={LogOut}><Image style={{alignSelf: "center", height: 30, width:75}} source={require("../assets/back.png")}/></Pressable>
          <Image style={{alignSelf: "center", height: 30, width:75, marginRight: 40}} source={require("../assets/Logo.png")}/>
          <Pressable onPress={() => navigation.navigate("Postpage")}><Image style={{alignSelf: "center", height: 31, width:31}} source={require("../assets/HomeIcon.png")}/></Pressable>
      </View>
        {messges.length > 0 && (
        <FlatList ref={(ref) => {this.flatListRef = ref;}} onContentSizeChange={() => {this.flatListRef.scrollToEnd({animated: true})}} style={{backgroundColor: "#000010"}} data={messges} renderItem={({item}) => <View style={{alignItems: item.user === auth.currentUser.displayName ? "flex-end" : "flex-start"}}>
          <Text style={{color: "white", alignSelf: "center", padding: 20}}>{item.user}</Text>
          <View key={item.id} style={{width: "70%",padding: 20,borderWidth:5, borderRadius:25, backgroundColor: "#299999", flexDirection: "row", alignItems: "center", paddingHorizontal: 10}}>
            <Image source={{uri: item.photoURL}} style={{height: 50, width:50, borderRadius: 25}}/>
            <Text style={{color: "white", paddingHorizontal: 15, width: "80%"}}>{item.text}</Text>
            </View>
            <Text style={{color: "white", paddingHorizontal: 20}}>{item.createdAt ? item.createdAt.toDate().toLocaleString() : ''}</Text>
          </View>}>
        </FlatList> )}
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