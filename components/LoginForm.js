import { Pressable, TextInput, Text, View, Image } from 'react-native';
import { useState, React } from "react";
import { FIREBASE_AUTH, FIREBASE_PROVIDER } from "../FirebaseConfig";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signInWithEmailAndPassword } from "firebase/auth";

export default function LoginForm({ navigation }) {
    
    var email = "";
    var pass = "";
    const auth = FIREBASE_AUTH;
    const prov = FIREBASE_PROVIDER;

    // If user is logged in, procced to logging him automatically whenever the app opens, Else => Do nothing
    const getItems = async () => {
        email = await AsyncStorage.getItem("email_key");
        pass = await AsyncStorage.getItem("pass_key");
      
        if(email != "" && pass != ""){
          signInWithEmailAndPassword(FIREBASE_AUTH, email, pass).
          // Success Signing In
          then(result => {navigation.navigate("Homepage"); const user = result.user; setSuccess("");}).
          // Failed Signing In
          catch(error => {});
        }
      }
      getItems();

    // Sign In Function
    const SignIn = async () => {
        signInWithEmailAndPassword(auth, emailValue, passwordValue).
        // Success Signing In
        then(result => {navigation.navigate("Homepage"); const user = result.user; setSuccess("");}).
        // Failed Signing In
        catch(error => {setSuccess("Λάθος Email ή Κωδικός"); setPasswordValue(""); setEmailValue("");});

        saveValueEm();
    }

    // Set email and password values to AsyncStorage
    const saveValueEm = () => {
        if(emailValue){
            AsyncStorage.setItem("email_key", emailValue);
            setEmailValue("");
        }
        
        if(passwordValue){
            AsyncStorage.setItem("pass_key", passwordValue);
            setPasswordValue("");
        }
    }

    // Setting the variables
    const[emailValue,setEmailValue] = useState("");
    const[passwordValue, setPasswordValue] = useState("");
    const[success, setSuccess] = useState("");


    // Handling the inputs
    const handleInputChangeEmail = (email) => {
        setEmailValue(email);
    }

    const handleInputChangePass = (password) => {
        setPasswordValue(password);
    }

    // HTML
    return (
        <>
            <View style={{paddingVertical: 50 ,alignItems: "center", backgroundColor: "#000000", borderBottomWidth: 6, borderTopWidth: 6, shadowColor: "#000", shadowOffset: {width:0, height: 15}, shadowOpacity: 0.5,shadowRadius: 12}}>
            <Image style={{alignSelf: "center", height: 30, width:75}} source={require("../assets/Logo.png")}/>
            </View>
            <View style={{alignItems: "center" , display: "flex", justifyContent: "center", flex: 1}}>
                <TextInput value={emailValue} onChangeText={handleInputChangeEmail} placeholder="Συμπλήρωσε το email σου" style={{width: "65%",margin: 5, padding: 5, borderWidth: 2,fontSize: 20, borderRadius: 13}}></TextInput>
                <TextInput value={passwordValue} onChangeText={handleInputChangePass} secureTextEntry={true} placeholder="Συμπλήρωσε τον κωδικό σου" style={{width: "70%", margin: 5, padding: 5, borderWidth: 2,fontSize: 20, borderRadius: 13}}></TextInput>
                <Pressable onPress={SignIn} style={{padding: 20}}><Text style={{color: "#1551FF", fontSize: 30, fontWeight: "800"}}>Σύνδεση.</Text></Pressable>
                <Text style={{padding: 10, color: "red" }}>{success}</Text>
            </View>
            <View style={{alignItems: "center", padding: 50}}>
                <Text style={{padding: 10}}>Δεν έχεις λογαριασμό;</Text>
                <Pressable onPress={() => navigation.navigate('SignUp')} style={{padding: 10}}><Text style={{color: "#1551FF", fontSize: 17, fontWeight: "700"}}>Φτιάξε λογαριασμό εδώ.</Text></Pressable>
            </View>
        </>
        );
    }