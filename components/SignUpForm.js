import { Pressable, TextInput, Text, View, Image, useWindowDimensions } from 'react-native';
import { useState, React } from "react";
import { FIREBASE_AUTH, FIREBASE_PROVIDER } from "../FirebaseConfig";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { getStorage, ref, uploadBytes, getDownloadURL} from "firebase/storage";
import { setDoc, collection, doc } from "firebase/firestore";
import { FIRESTORE } from "../FirebaseConfig";


export default function SignUpForm({ navigation }) {
    const db = FIRESTORE;
    const auth = FIREBASE_AUTH;
    const prov = FIREBASE_PROVIDER;
    const storage = getStorage();

    const[uploading,setUploading] = useState(false);
    var r = (Math.random() + 1).toString(36).substring(7);

    // Picking an Image from our image library
    const PickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 4],
          quality: 0,
        });


        // Setting and downscaling the image using Expo's ImageManipulator || Profile Pictures doesn't need to be high quality.
        if (!result.canceled) {
            const downscaleImage = await ImageManipulator.manipulateAsync(result.assets[0].uri,[{ resize: {width: 200, height: 200}}], { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG});
            setImage(downscaleImage.uri);
        }
 
    };

    const usersRef = collection(db, "users");
    
    // Uploading to Firebase Storage
    const UploadImage = async () => {
        const storage = getStorage();
        const storageRef = ref(storage, "images/" + r + ".png");
        const response = await fetch(image);
        const blob = await response.blob();
      
        try {
          const snapshot = await uploadBytes(storageRef, blob);
          const url = await getDownloadURL(storageRef);
          setProfileImg(url);
      
          await updateProfile(auth.currentUser, {
            displayName: nameValue,
            photoURL: url,
            uid: auth.currentUser.uid,
            friendsList: []
          });
      
          await setDoc(doc(usersRef, auth.currentUser.uid), {
            displayName: nameValue,
            email: auth.currentUser.email,
            friendsList: [],
            photoURL: url,
            uid: auth.currentUser.uid
          });
        } catch (error) {
          // Handle any errors that occur during the upload or setting of documents
        }
      };

    // Signing up logic
    const SignUp = async () => {
        const createUser = await createUserWithEmailAndPassword(auth, emailValue, passwordValue);
        await UploadImage();
        await navigation.navigate("Login");
    };
      
    // Variable Declaration
    const[emailValue,setEmailValue] = useState("");
    const[passwordValue, setPasswordValue] = useState("");
    const[nameValue,setNameValue] = useState("");
    const[image, setImage] = useState("https://firebasestorage.googleapis.com/v0/b/xrc-chat.appspot.com/o/profilepic.png?alt=media&token=c61fb7e0-d08d-46fc-a02a-d00238d31ba6");
    const[profileImg, setProfileImg] = useState("");
    const windowHeight = useWindowDimensions().height;

    // Handling The Inputs
    const handleInputChangeName = (name) => {
        setNameValue(name);
    }

    const handleInputChangeEmail = (email) => {
        setEmailValue(email);
    }

    const handleInputChangePass = (password) => {
        setPasswordValue(password);
    }

    //HTML
  return (
    <>
        <View style={{paddingVertical: 50 ,alignItems: "center", backgroundColor: "#000000", borderBottomWidth: 6, borderTopWidth: 6, shadowColor: "#000", shadowOffset: {width:0, height: 15}, shadowOpacity: 0.5,shadowRadius: 12}}>
        <Image style={{alignSelf: "center", height: 30, width:75}} source={require("../assets/Logo.png")}/>
        </View>
        <View style={{alignItems: "center" , display: "flex", justifyContent: "center", flex: 1, minHeight: Math.round(windowHeight - 300 )}}>
            <Pressable onPress={PickImage} style={{padding: 20}}><Image style={{width:100, height: 100, borderRadius: 50}} source={{uri: image}}></Image></Pressable>
            <TextInput value={nameValue} onChangeText={handleInputChangeName} placeholder="Συμπλήρωσε το όνομα σου" style={{width: "65%",margin: 5, padding: 5, borderWidth: 2,fontSize: 20, borderRadius: 13}}></TextInput>
            <TextInput value={emailValue} onChangeText={handleInputChangeEmail} placeholder="Συμπλήρωσε το email σου" style={{width: "65%",margin: 5, padding: 5, borderWidth: 2,fontSize: 20, borderRadius: 13}}></TextInput>
            <TextInput value={passwordValue} onChangeText={handleInputChangePass} secureTextEntry={true} placeholder="Συμπλήρωσε τον κωδικό σου" style={{width: "70%", margin: 5, padding: 5, borderWidth: 2,fontSize: 20, borderRadius: 13}}></TextInput>
            <Pressable onPress={SignUp} style={{padding: 20}}><Text style={{color: "#1551FF",fontSize: 30,fontWeight: "800"}}>Εγγραφή.</Text></Pressable>
        </View>
        <View style={{alignItems: "center", padding: 50}}>
            <Text style={{padding: 10}}>Έχεις ήδη λογαριασμό;</Text>
            <Pressable onPress={() => navigation.navigate('Login')} style={{padding: 10}}><Text style={{color: "#1551FF", fontSize: 17,fontWeight: "700"}}>Συνδέσου εδώ.</Text></Pressable>
        </View>
    </>
    );
}