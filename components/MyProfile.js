import { useState, React, useEffect } from "react";
import { Pressable, Text, View, Image } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { FIREBASE_AUTH } from "../FirebaseConfig";
import { FIRESTORE } from "../FirebaseConfig";
import { collection, query, getDocs } from "firebase/firestore";

export default function MyProfile({ navigation}) {
    const db = FIRESTORE;
    const auth = FIREBASE_AUTH;


    const [userData, setUserData] = useState();

    // Copy the the users ID to clipboard
    const copyToClipboard = async () => {
      await Clipboard.setStringAsync(userData.uid);
    };

    // Fetching the data of the logged in user's profile
    useEffect(() => {
      const fetchProfile = async () => {
        const q = query(collection(db, "users"));
        const querySnapshot = await getDocs(q);
        let msgs;
        querySnapshot.forEach((doc) => {
          if(doc.id == auth.currentUser.uid);
            msgs = doc.data();
        });
        setUserData(msgs);
      };
    
      fetchProfile();
    }, []);

    // HTML
      return (
        <>
        <View style={{ paddingHorizontal: 20, justifyContent: "space-between", flexDirection: "row", paddingVertical: 50 , alignItems: "center", backgroundColor: "#000000", borderBottomWidth: 6, borderTopWidth: 6, shadowColor: "#000", shadowOffset: {width:0, height: 15}, shadowOpacity: 0.5,shadowRadius: 12}}>
        <Pressable onPress={() => navigation.navigate("Postpage")}><Image style={{alignSelf: "center", height: 30, width:75}} source={require("../assets/back.png")}/></Pressable>
        <Image style={{alignSelf: "center", height: 30, width:75, marginRight: 40}} source={require("../assets/Logo.png")}/>
        <Pressable onPress={copyToClipboard}><Image style={{alignSelf: "center", height: 31, width:31}}/></Pressable>
        </View>
        <View style={{flex: 1, backgroundColor: "black", padding: 20}}>
            {userData && userData.photoURL ? (
              <View style={{paddingVertical: 50, alignContent: "center", alignItems: "center", backgroundColor: "black"}}>
                <Image style={{ height: 175, width: 175, borderRadius: 85 }} source={{ uri: userData.photoURL }}/>
                <Text style={{textAlign: "left",paddingVertical: 20}}><Text style={{color: "white",fontWeight: 900, fontSize: 20}}>Name: </Text><Text style={{color: "#669999", fontSize: 20}}>{auth.currentUser.displayName}</Text></Text>
                <Text style={{textAlign: "left",paddingVertical: 20}}><Text style={{color: "white",fontWeight: 900, fontSize: 20}}>UserID: </Text><Text style={{color: "#669999", fontSize: 20}}>{userData.uid}</Text></Text>
                <Pressable onPress={copyToClipboard} style={{borderWidth: 2, borderColor: "white", borderRadius: 15, padding: 10, backgroundColor: "#669999"}}><Text style={{color: "white", fontSize: 20, fontWeight: 600}}>Αντιγραφή User ID</Text></Pressable>
                <Text style={{textAlign: "left",paddingVertical: 20}}><Text style={{color: "white",fontWeight: 900, fontSize: 20}}>Email: </Text><Text style={{color: "#669999", fontSize: 20}}>{auth.currentUser.email}</Text></Text>
              </View>
            ) : null}
            </View>
          <View>
        </View>
        </>
      );
    }