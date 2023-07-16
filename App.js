import LoginForm from "./components/LoginForm";
import SignUpForm from "./components/SignUpForm";
import Homepage from "./components/Homepage";
import Postpage from "./components/Postpage";
import FriendsList from "./components/FriendsList";
import Post from "./components/Post";
import PrivateMessages from "./components/PrivateMessages";
import MyProfile from "./components/MyProfile";

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

export default function App() {

const Stack = createStackNavigator();

return (
  <NavigationContainer>
    <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginForm} />
      <Stack.Screen name="SignUp" component={SignUpForm} />
      <Stack.Screen name="Homepage" component={Homepage}/>
      <Stack.Screen name="Postpage" component={Postpage}/>
      <Stack.Screen name="MyProfile" component={MyProfile}/>
      <Stack.Screen name="Friendslist" component={FriendsList}/>
      <Stack.Screen name="Post" component={Post}/>
      <Stack.Screen name="PrivateMessages" component={PrivateMessages}/>
    </Stack.Navigator>
  </NavigationContainer>
  );
}