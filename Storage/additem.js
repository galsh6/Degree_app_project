import 'react-native-gesture-handler';
import { TextInput, View, Text, Button,Pressable,TouchableWithoutFeedback} from "react-native";
import { useEffect, useState,} from 'react';
import { styles} from '../../StyleSheet';
import { getDatabase, ref, child, get,update} from 'firebase/database';
import axios from 'axios';
import auth from '@react-native-firebase/auth';
import { SlideInRight } from 'react-native-reanimated';
function Additem({ navigation }){
    const foodProducts = ["Banana", "Apple", "Cucumber", "Orange", "Carrot", "Grapes", "Tomato",
     "Strawberry", "Broccoli", "Peach", "Lettuce", "Watermelon", "Potato", "Pineapple", "Spinach",
      "Mango", "Bell pepper", "Blueberries", "Celery", "Kiwi", "Cauliflower", "Cherry",
       "Green Beans", "Apricot", "Radish", "Pear", "Avocado", "Raspberry", "Zucchini", "Plum",
        "Eggplant", "Blackberries", "Asparagus", "Coconut", "Pomegranate", "Artichoke", "Lemon",
         "Sweet Potato", "Brussels Sprouts", "Onion", "Kale", "Guava", "Beet", "Papaya", "Pumpkin",
          "Mushroom", "Pears", "Nectarine", "Tangerine", "Dates", "Rhubarb", "Squash", "Milk", "Cheese",
           "Yogurt", "Butter"];

//* State variables to store input values
//to show/hide the alert
const [showalert,setalert]= useState("none")
//the text in the alert
const [textalert,writealert]= useState("")
const [data,dataset]= useState("")
const [type, typeset] = useState(""); //* Type of the item
const [Item, Itemset] = useState(""); //* Name of the item
const [amount, amountset] = useState(""); //* Amount of the item
const [weight, weightset] = useState(""); //* Weight of the item
const [camitem, setcam] = useState(""); //* item from camera
const [url, seturl] = useState("");
const [isr,rloead] =useState(false);//*update the storage
const googleapi = "AIzaSyAsVJCvR4GMeAu78wnqEAddj5a9ZJ-IMFU"
//* to get the curent user uid
    const user = auth().currentUser
    const uid = user.uid 
//* Database initialization
const db = getDatabase();
const dbRef = ref(getDatabase());
//* Fetching data from the database
useEffect(()=>{
  get(child(dbRef, `Data/`)).then((snapshot) => {
    if (snapshot.exists()) {
        //* If data exists, extract the snapshot's value
        const d = snapshot.val();
        //* Update the dataset state with the keys of items under 'Items' node
        dataset(Object.keys(d.Users[uid].Items));
        console.log(d.cam[d.Users[uid].cam.id].url)
      seturl(d.cam[d.Users[uid].cam.id].url)
    }
  }).catch((error) => console.error(error));
  rloead(false)
},[,isr])


//* Function to add a new item to the database
async function add() {
    //* Update the database with the new item's details
   await update(ref(db, `Data/Users/${uid}/Items/${type}/${Item}/`), {
        'amount': amount, //* Set the amount of the item
        'weight': weight //* Set the weight of the item
    });
   rloead(true)
    navigation.navigate('Storage')
}

async function anlays() {
    try {
      console.log(url)
        //* Replace `[ESP32_IP_ADDRESS]` with the actual IP address of your ESP32
        const response = await axios.get(`http://${url}:82/image`, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'cache-control': 'no-cache'
            }
        });

        //* Check if the request was successful
        if (response.status !== 200) {
            throw new Error('Network response was not ok');
        }

        //* Handle the JSON data as needed

        //* Example: Accessing specific fields in the JSON object
        const imgb64 = response.data.image;
        const requestData = {
            requests: [
                {
                    image: {
                        content: imgb64,
                    },
                    features: [
                        {
                            type: 'LABEL_DETECTION',
                            maxResults: 10,
                        },
                    ],
                },
            ],
        };

        //* Sending a POST request to Google Cloud Vision API
        axios.post(`https://vision.googleapis.com/v1/images:annotate?key=${googleapi}`, requestData)
            .then(response => {
                //* Handling the response from Google Cloud Vision API
                const descriptions = response.data.responses[0].labelAnnotations.map(annotation => annotation.description);
                let dif = 0
                descriptions.forEach(element => {
                  console.log(element)
                 
                    if (foodProducts.indexOf(element) != -1) {
                      console.log(foodProducts.indexOf(element))
                        //* If a food product is detected, set the 'cam' state and return
                        setcam(element);
                        Itemset(element)
                        dif = 1
                        return 1
                    }
                });
                //* If no food product is detected, display an alert
                if(dif == 0){
                writealert("the camera didn't detect a food product");
                setalert("");
                return;}
                //* Handle the response data here
            })
            .catch(error => {
                console.error('Error:', error);
                //* Handle errors here
            });
    } catch (error) {
        //* Handle errors
        writealert("there was a problem with your camera");
        setalert("");
    }
}

    return(
    <View style={styles.container}>
      {//! navigation bar 
      }
    <View style={styles.navigationbar}>
        <Pressable 
         onPress={()=>{navigation.toggleDrawer();}}> 
         <Text style={styles.navbaricon}>☰</Text>
        </Pressable>
        <Pressable 
         onPress={()=>{navigation.navigate('Storage')}}>
         <Text style={styles.navbartext}>Storage</Text>
        </Pressable>
        <Pressable 
         onPress={()=>{return null}}>
         <Text style={styles.navbarcur}>Add Item</Text>
        </Pressable>
        {//! start of screen 
        }
        
    </View>
    
    <View style={[styles.card,{height: 350}]}>
  {/*//* Row for Type input */}
  <View style={styles.cardrowt}>
    <Text style={styles.textlogin}>Type</Text>
    {/*//* Input field for Type */}
    <TextInput
      style={styles.logintextinput}
      textAlign="center" 
      onChangeText={text =>{typeset(text)}}
    />
  </View>
  {/*//* Row for Item input */}
  <View style={styles.cardrowt}>
    <Text style={styles.textlogin}>Item</Text>
    {/*//* Input field for Item */}
    <TextInput
      style={styles.logintextinput}
      textAlign="center"
      onChangeText={text =>{setcam(text); Itemset(text)}}
      value={camitem}
    />
  </View>
  {/*//* Row for amount input */}
  <View style={styles.cardrowt}>
    <Text style={styles.textlogin}>amount</Text>
    {/*//* Input field for amount */}
    <TextInput
      style={styles.logintextinput}
      textAlign="center" 
      onChangeText={text =>{amountset(text)}}
      keyboardType='number-pad'
    />
  </View>
  {/*//* Row for weight input */}
  <View style={styles.cardrowt}>
    <Text style={styles.textlogin}>weight</Text>
    {/*//* Input field for weight */}
    <TextInput
      style={styles.logintextinput}
      textAlign="center" 
      onChangeText={text =>{weightset(text)}}
      keyboardType='number-pad'
    />
  </View>
  {/*//* Row for buttons */}
  <View style={styles.cardrowb}>
    {/*//* Submit button */}
    <Button
      title='submit'
      onPress={()=>{add() 
      }}
    />
    {/*//* Button to use camera */}
    <Button
      title='use camera'
      onPress={() =>{anlays()}}
    />
  </View>
</View>
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
    )
}
export{Additem}