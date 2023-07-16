import { useState, React } from "react";
import { Pressable, TextInput, Text, View, Image, KeyboardAvoidingView } from 'react-native';
import { FIREBASE_AUTH } from "../FirebaseConfig";
import { FIRESTORE } from "../FirebaseConfig";
import { getStorage, ref, uploadBytes, getDownloadURL} from "firebase/storage";
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { ScrollView } from "react-native-gesture-handler";
import {  collection, serverTimestamp,setDoc, doc } from "firebase/firestore";

export default function Post({navigation}) {

  const db = FIRESTORE;
  const auth = FIREBASE_AUTH;
  const messagesRef = collection(db, "posts");
  const[finalImage,setFinalImage] = useState("");
  const[image, setImage] = useState("https://firebasestorage.googleapis.com/v0/b/xrc-chat.appspot.com/o/Sample.png?alt=media&token=9bbcdb24-f6df-4ffc-95a8-16140445f175");
  const[descriptionValue,setDescriptionValue] = useState("");
  const handleInputChangeDescription = (description) => {
    setDescriptionValue(description);
}


 // Picking the post's image.
  const PickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
      // Setting and downscaling the image using Expo's ImageManipulator || Profile Pictures doesn't need to be high quality.
      if (!result.canceled) {
          const downscaleImage = await ImageManipulator.manipulateAsync(result.assets[0].uri,[{ resize: {width: 400, height: 400}}], { compress: 0.4, format: ImageManipulator.SaveFormat.JPEG});
          setImage(downscaleImage.uri);
      }
};

// Creating a random image name
var r = (Math.random() + 1).toString(36).substring(7);

// Uploading the image to the database
const UploadImage = async () => {
    try {
      const storage = getStorage();
      const storageRef = ref(storage, "posts/" + r + ".png");
      const response = await fetch(image);
      const blob = await response.blob();
  
      const snapshot = await uploadBytes(storageRef, blob);
      const url = await getDownloadURL(snapshot.ref);
  
      setFinalImage(url);
      await AddPost(url);
      console.log(url);
    } catch (error) {
      console.log("Error uploading image:", error);
    }
  };
  
  // Finally, adding the whole post to the database.
  const AddPost = async (url) => {
    try {
      await setDoc(doc(messagesRef), {
        createdAt: serverTimestamp(),
        user: auth.currentUser.displayName,
        profilePic: auth.currentUser.photoURL,
        postPic: url,
        uniqueID: Date.now(),
        description: descriptionValue,
      });
      await navigation.navigate("Postpage");
    } catch (error) {
      console.log("Error adding post:", error);
    }
  };

  const Final = async () => {
    await UploadImage();
    await AddPost();
  }

  // HTML
  return (
    <>
    <View style={{ paddingHorizontal: 20, justifyContent: "space-between",flexDirection: "row",paddingVertical: 50 ,alignItems: "center", backgroundColor: "#000000", borderBottomWidth: 6, borderTopWidth: 6, shadowColor: "#000", shadowOffset: {width:0, height: 15}, shadowOpacity: 0.5,shadowRadius: 12}}>
        <Pressable onPress={() => navigation.navigate("Postpage")}><Image style={{alignSelf: "center", height: 30, width:75}} source={require("../assets/back.png")}/></Pressable>
        <Image style={{alignSelf: "center", height: 30, width:75}} source={require("../assets/Logo.png")}/>
        <Pressable onPress={() => navigation.navigate("Homepage")}><Image style={{alignSelf: "center", height: 31, width:31}} source={require("../assets/HomeIcon.png")}/></Pressable>
    </View>
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : null} style={{backgroundColor: "black", flex: 1,  borderTopColor: "#669999", borderTopWidth: 3}}>
        <ScrollView>
    <View>
        <Pressable onPress={PickImage}><Image style={{height: 400, width: "100%"}} source={{uri: image}}/></Pressable>
        <TextInput placeholderTextColor={"white"} value={descriptionValue} onChangeText={handleInputChangeDescription} placeholder="Τι σκέφτεσαι;" style={{width: "90%", padding: 10, borderWidth: 2,fontSize: 20, borderRadius: 13, borderColor: "white", alignSelf: "center", margin: 20, color: "white"}}></TextInput>
        <Pressable onPress={UploadImage} style={{alignSelf: "center"}}><Text style={{color: "white",fontWeight: 700, borderRadius: 20,padding: 15, textAlign: "center", fontSize: 20, backgroundColor: "#669999"}}>Πόσταρε το!</Text></Pressable>
    </View>
    </ScrollView>
    </KeyboardAvoidingView>
    </>
    );
  }