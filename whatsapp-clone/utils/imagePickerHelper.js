// imageHelper.js
import * as ImagePicker from 'expo-image-picker';
import { Platform } from 'react-native';
import { storage } from './firebaseHelper'; // Import storage directly
import uuid from 'react-native-uuid';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

export const launchImagePicker = async () => {
    await checkMediaPermissions();
    
    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1
    });

    

    if (!result.cancelled) {
       result.assets[0].uri
    }

    return result.assets[0].uri;
}

export const uploadImageAsync = async (uri) => {
    const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            resolve(xhr.response);
        };

        xhr.onerror = function(e) {
            console.log(e);
            reject(new TypeError("Network request failed"));
        };

        xhr.responseType = "blob";
        xhr.open("GET", uri, true);
        xhr.send();
    });

    const pathFolder = 'profilePics';
    const storageRef = ref(storage, `${pathFolder}/${uuid.v4()}`);

    await uploadBytesResumable(storageRef, blob);

    blob.close();

    return await getDownloadURL(storageRef);
}

const checkMediaPermissions = async () => {
    if (Platform.OS !== 'web') {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            return Promise.reject("We need permission to access your photos");
        }
    }

    return Promise.resolve();
}
