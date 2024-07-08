import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { TextInput, View, Text, Button, TouchableWithoutFeedback, Animated,} from "react-native";
import { useState, useEffect, useRef} from 'react';
import { styles} from '../StyleSheet';
import {} from '@react-native-firebase/app'
import auth, { } from '@react-native-firebase/auth';
import  {ref, getDatabase, update} from 'firebase/database';
import {app} from '../config'
 function Login({ navigation }) {
  //get firebase realtime db ref
  const db = getDatabase(app);
  //if the user isnt null sign out the current user
  if(auth().currentUser != null){
  auth().signOut()
  }
  //to show/hide the alert
  const [showalert,setalert]= useState("none")
  //the text in the alert
  const [textalert,writealert]= useState("")
  // the loging email
  const [email, setemail] = useState("")
  //the login password
  const [pass, setpass] = useState("")
  //the sign up email
  const [upemail, setupemail] = useState("")
  //the sign up password  
  const [uppass, setuppass] = useState("")
  //the forget my password email
  const [forgoremail, setfpemail] = useState("")

  // fadeAnim will be used as the value for opacity. Initial Value: 0
  const fadeAnim = useRef(new Animated.Value(0)).current;
 //fadein animation
  const fadeIn = () => {
    // Will change fadeAnim value to 1 in .85 seconds
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 850,
      useNativeDriver: true,
    }).start();
  };
//fadeout animation
  const fadeOut = () => {
    
    // Will change fadeAnim value to 0 in .5 seconds
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };
  //if the ovarlay for sign up will be hided or not
  const [showup, setshowup] = useState("none");
//if the ovarlay for forget my password will be hided or not
  const [showfp, setshowfp] = useState("none");
  //disable the buttons while the animation is on
  const [disable, setdisable] = useState(false);
  //fade in/out action
  useEffect( () => {
    // hide -> display
    if(showup == "flex"){ 
       // Call fadeIn animation function
      fadeIn(); 
      //time out
      setTimeout(() => {
        setdisable(true); // Disable the buttons affter 500 milliseconds
      }, 500); 
    }//display -> hide
     else { 
      // Call fadeOut animation function
      fadeOut(); 
      setTimeout(() => {
        setshowup("none"); // close the overley after a delay of 500 milliseconds
        setTimeout(() => {
          setdisable(false); // enable the buttons affter 500 milliseconds
        }, 200);
      }, 500);
    }
  }, [showup]); // Execute this effect whenever 'showup' state changes
  // the useEffect for the forgate my password overlay
  useEffect( () => {
    if(showfp == "flex"){ 
      // If the state 'showfp' is 'flex', perform fade-in animation and disable interactions
      fadeIn(); // Call fadeIn animation function
      setTimeout(() => {
        setdisable(true); // Disable interactions after a delay of 500 milliseconds
      }, 500);
    } else { 
      // If the state 'showfp' is not 'flex', perform fade-out animation and enable interactions
      fadeOut(); // Call fadeOut animation function
      setTimeout(() => {
        setshowfp("none"); // Set 'showfp' state to 'none' after a delay of 500 milliseconds
        setTimeout(() => {
          setdisable(false); // Enable interactions after a delay of 200 milliseconds
        }, 200);
      }, 500);
    }
  }, [showfp]); // Execute this effect whenever 'showfp' state changes
  
  return (
    // the main view that the all screen is in
    <View style={styles.container}>
     {/* the start of the view that display the card */}
      <View style={styles.card}>
      {/* the first row, the row of the Email */}
        <View style={styles.cardrowt}>
          <Text style={styles.textlogin}>Email</Text>
          <TextInput
            style={styles.logintextinput}
            placeholder="Email"
            textAlign="center" 
            // save the input in usestate on changing the text
            onChangeText={nextemail => setemail(nextemail)}/>
        </View>
        {/* start the secind row, the row of the password */}
        <View style={styles.cardrowt}>
          <Text style={styles.textlogin}>password</Text>
          <TextInput
            style={styles.logintextinput}
            placeholder=" password"
            textAlign="center"
            // making the text in input tu appear as dots
            secureTextEntry={true} 
            // save the input in usestate on changing the text
            onChangeText={nextpass =>setpass(nextpass)}/>
          </View>
          
           {/* start of the third row, the row of the buttons */}
          <View style={styles.cardrowb}>
  <Button 
    title="log in" 
    onPress={() => {
      // Check if both email and password are not empty
      if(email != "" && pass != ""){
        // Attempt to sign in with provided email and password
        auth().signInWithEmailAndPassword(email, pass)
          .then(() => {
            
            // Navigate to 'Storage' screen upon successful login
            navigation.navigate('Storage');
          })
          .catch(error => {
            // Display an alert if sign-in fails due to invalid email or password
            writealert("Your email or password is invalid");
            setalert("");
          });
      } else {
        // Display an alert if either email or password is empty
        writealert("please enter the your Email and password");
        setalert("");
      }
    }} 
  />

       

  <Button 
    title="sign up" 
    onPress={() => setshowup("flex")} 
    // When 'Sign Up' button is pressed, show the sign-up overlay
    disabled={disable} 
    // Disable the button if 'disable' state is true
  />
</View>
<View style={styles.cardrowb}>
  {/* Row containing the 'Forgot my Password' button */}
  <Button 
    title="forgot my password" 
    onPress={() => setshowfp("flex")} 
    // When 'Forgot my Password' button is pressed, show the 'Forgot Password' overlay
    disabled={disable} 
    // Disable the button if 'disable' state is true
    style={{justifyContent: "center"}} 
    // Style the button to center its content horizontally
  />
</View>

      </View>
      {/* ------------forgot my password overlay------------ */}
      {/* TouchableWithoutFeedback to handle touches and close the 'Forgot Password' overlay */}
<TouchableWithoutFeedback onPress={() => setshowfp("none")}>
  {/* This view overlays the content with the gray back ground */}
  <View style={[styles.overlay,{display: showfp}]}>
    {/* TouchableWithoutFeedback to disable the first TouchableWithoutFeedback */}
    <TouchableWithoutFeedback>
      {/* Animated view for fade-in effect */}
      <Animated.View style={[styles.cardfadefp,{display: showfp, opacity: fadeAnim}]}>
        {/* View for the row containing the 'Email' label and input field */}
        <View style={styles.cardrowt}>
          <Text style={styles.textlogin}>Email</Text>
          {/* Update the email state when the text changes */}
          <TextInput
            style={styles.logintextinput}
            placeholder="Email"
            textAlign="center" 
            onChangeText={nextupemail => setfpemail(nextupemail)} 
          />
        </View>
        {/* View for the row containing the 'Submit' and 'Close' buttons */}
        <View style={styles.cardrowb}>
          {/* Title for the 'Submit' button */}
          <Button 
            title='submit' 
            // When 'Submit' button is pressed
            onPress={() => {
               // Check if the input email is not empty
              if(forgoremail != ""){ 
               // Send password reset email
                auth().sendPasswordResetEmail(forgoremail)
                  .then(() => {
                    setshowfp("none"); // Hide the 'Forgot Password' overlay
                  })
                  .catch(error => { // Catch any errors during sending password reset email
                    setshowfp("none");
                    writealert("your Email is invalid"); // Display an alert for invalid email
                    setalert("");
                  });
              } else {
                // If email is empty, display an alert
                setshowfp("none");
                writealert("please enter your Email");
                setalert("");
              }
            }} 
          />
          <Button 
            title='close' 
            //close the overlay when pressed 
            onPress={() => {setshowfp("none")}} 
          />
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  </View>
</TouchableWithoutFeedback>

      {/*------------- signup overlay  ----------------*/}
      <TouchableWithoutFeedback
      // When pressed the sigbup part colsed
  onPress={() => setshowup("none")} 
>
{/* This view overlays the loging part with gray background */}
  <View style={[styles.overlay,{display: showup}]}>
    {/* TouchableWithoutFeedback to disable the first one on the contect of the signup*/}
    <TouchableWithoutFeedback> 
      {/* Animated view for fade-in effect and the main view for the signup*/}
      <Animated.View style={[styles.cardfade,{display: showup, opacity: fadeAnim}]}>
        {/* View for the row containing the 'Email' label and input field */}
        <View style={styles.cardrowt}> 
          {/* Text displaying the label 'Email' */}
          <Text style={styles.textlogin}>Email</Text> 
          <TextInput
            style={styles.logintextinput}
            placeholder="Email"
            textAlign="center" 
            // Update the upemail usestate component state when the text changes
            onChangeText={nextupemail => setupemail(nextupemail)} 
          />
        </View>
        {/* View for the row containing the 'Password' label and input field */}
        <View style={styles.cardrowt}> 
          {/* Text displaying the label 'Password' */}
          <Text style={styles.textlogin}>password</Text> 
          <TextInput
            style={styles.logintextinput}
            placeholder="password"
            textAlign="center"
            // Display password characters as dots
            secureTextEntry={true} 
            // Update the uppass usestate component state when the text changes
            onChangeText={newxuppass => setuppass(newxuppass)} 
          />
        </View>
        <View style={styles.cardrowt}>
          {/* Empty view for sapce */}
        </View>
        {/* View for the row containing the 'Sign Up' and 'Close' buttons */}
        <View style={styles.cardrowb}>
          <Button 
            title="        sign up        " 
            // When 'Sign Up' button is pressed
            onPress={() =>{ 
              // Check if email and password are not empty
              if(upemail!="" && uppass!=""){ 
                // Create a new user with the provided email and password
                auth().createUserWithEmailAndPassword(upemail,uppass)
                  .then((userdata) =>{
                    newuid = userdata.user.uid
                    newemail = userdata.user.email
                    // Update the database with the new user
                    update(ref(db, 'Data/Users/' + newuid), {
                      Email : newemail
                    })
                    // close the sign-up after successful sign-up
                    .then(() => setshowup("none"))
                    // Catch any errors during sign-up
                  }).catch(error=>{
                    // Display an alert for any sign-up errors
                    setshowup("none")
                    writealert("there was a problem with your Email")
                    setalert("")
                  })
              }else{
                // If email or password is empty, display an alert
                setshowup("none")
                writealert("please enter an Email and password")
                setalert("")
              }
            }} 
          />
          <Button 
            title="         close         " 
            // When 'Close' button is pressed, close the sign-up
            onPress={() => setshowup("none")} 
          />
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  </View>
</TouchableWithoutFeedback>

   {/* --------alert-------- */}
   <TouchableWithoutFeedback
  onPress={() => (setalert("none"))} // When pressed the alert is closed
>
{/* This view overlays the content with the gray background */}
  <View style={[styles.overlay,{display: showalert}]}> 
  {/* TouchableWithoutFeedback to disable the first one on the alert */}
    <TouchableWithoutFeedback> 
    {/* View containing the alert and setting the card */}
      <View style={styles.cardalert}> 
      {/* View for the row containing the alert text */}
        <View style={styles.cardrowt}> 
         {/* Text displaying the alert message */}
          <Text style={styles.textlogin}>{textalert}</Text> 
        </View>
        {/* View for the row containing the 'Close' button */}
        <View style={styles.cardrowt}> 
        {/* the 'Close' button */}
          <Button 
            title='Close' 
            onPress={()=>(setalert("none"))} 
            // When 'Close' button is pressed the alert is colsed
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  </View>
</TouchableWithoutFeedback>

    </View>
  );
  
}
export{Login}
