import { useState, React, useEffect } from "react";
import { Pressable, TextInput, Text, View, Image, FlatList, KeyboardAvoidingView, Alert } from 'react-native';
import { FIREBASE_AUTH } from "../FirebaseConfig";
import { FIRESTORE } from "../FirebaseConfig";
import { collection, query, doc, onSnapshot, arrayUnion, updateDoc } from "firebase/firestore";

export default function FriendsList({ navigation}) {

    const db = FIRESTORE;
    const auth = FIREBASE_AUTH;
    const friendsRef = collection(db, "users");
    const chatsRef = collection(db, "chats");
    const [currentFriendConst,currentSetFriendConst] = useState([]);
    const [name,setName] = useState([]);
    const [textInput, setTextInput] = useState("");

    // Adding the friend
    const addFriend = async () => {
      try {
        const ffriendsRef = doc(db, "users", textInput);
        const usersRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(usersRef, {friendsList: arrayUnion(textInput)});
        await updateDoc(ffriendsRef, {friendsList: arrayUnion(auth.currentUser.uid)});
      } catch {
        Alert.alert("User ID Not Found", "Provide a correct User ID");
        console.log("Not provided with a correct ID");
      }
    }
    
    // Handling the user's input
    const handleInputChangeText = (text) => {
      setTextInput(text);
    }

    // Navigate to a user's private chat based on the selected User ID
    const handleUserPress = (userId) => {
      navigation.navigate('PrivateMessages', { userId });
    };

    // Query to check if the logged in user's id matches with the desired private chat user
    useEffect(() => {
      const friendsQuery = query(friendsRef);
      const unsubscribe2 = onSnapshot(friendsQuery, (snapshot) => {
        let userFriends = [];
        let namee = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          if(doc.id === auth.currentUser.uid){
            data.friendsList.forEach((data1)=>{userFriends.push(data1);});
          }
          const t = data.uid.includes(userFriends);
        })
        try{
          userFriends.forEach((doc) => {
            snapshot.forEach((doc1) => {
              if(doc == doc1.data().uid){
                namee.push(doc1.data());
              }
            })
          })
        } catch {
          console.log("error");
        }

        currentSetFriendConst(userFriends);
        setName(namee);
      })
        return () => unsubscribe2;
      }, [])


      // HTML
      return (
        <>
        <View style={{ paddingHorizontal: 20, justifyContent: "space-between", flexDirection: "row", paddingVertical: 50 , alignItems: "center", backgroundColor: "#000000", borderBottomWidth: 6, borderTopWidth: 6, shadowColor: "#000", shadowOffset: {width:0, height: 15}, shadowOpacity: 0.5,shadowRadius: 12}}>
        <Pressable onPress={() => navigation.navigate("Postpage")}><Image style={{alignSelf: "center", height: 30, width:75}} source={require("../assets/back.png")}/></Pressable>
        <Image style={{alignSelf: "center", height: 30, width:75, marginRight: 70}} source={require("../assets/Logo.png")}/>
        <Pressable><Image/></Pressable>
        </View>
        <View style={{flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 20, backgroundColor: "black"}}>
          <TextInput placeholderTextColor={"white"} value={textInput} onChangeText={handleInputChangeText} style={{height: 60, color: "white"}} placeholder="Πρόσθεσε το User ID του χρήστη."></TextInput>
          <Pressable onPress={addFriend}><Image style={{height: 50, width: 50}} source={require("../assets/FriendsPlus.png")}/></Pressable>
        </View>
        <View style={{backgroundColor: "black", padding: 10}}>
          <Text style={{color: "white", textAlign: "center", fontWeight: 800, fontSize: 23, padding: 10, textDecorationLine: 'underline'}}>Λίστα φίλων</Text>
        </View>
        <FlatList style={{backgroundColor: "#000010", padding: 15}} data={name} keyExtractor={name.uid} renderItem={({item}) => (
        <View>
          <View style={{flexDirection: "row", flex: 1, alignItems: "center", padding: 10, width: "100%", borderWidth: 5, backgroundColor: "#299999", borderRadius: 20}}>
            <Pressable onPress={() => handleUserPress(item.uid)}><Image style={{height: 75, width: 75}} source={{uri: item.photoURL}}/></Pressable>
            <Text style={{fontSize: 20 ,padding: 10 , textAlign: "center", color: "white"}}>{item.displayName}</Text>
          </View>
        </View>)}>
        </FlatList>
        </>
      );
    }