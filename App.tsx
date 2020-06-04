import React, { useState } from 'react';
import { Image, StyleSheet, Text, View, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker'
import * as ImageSharing from 'expo-sharing'
import uploadToAnonymousFilesAsync from 'anonymous-files'
import logo from './assets/logo.png'
import Button from './src/components/Button'

interface AppProps {
	localUri: string,
	remoteUri: string
}

const App: React.FC<AppProps> = ({ localUri, remoteUri }) => {
	const [selectedImage, setSelectedImage] = useState(localUri)
	const [fileServerUri, setFileServerUri] = useState(remoteUri)
	const openImagePickerAsync = async (): Promise<void> => {
		const permissionResult = await ImagePicker.requestCameraRollPermissionsAsync()
		if (permissionResult.granted === false) {
			alert('Permission to access camera roll is required')
			return
		}
		const pickerResult = await ImagePicker.launchImageLibraryAsync()
		if (pickerResult.cancelled) {
			return
		}
		setSelectedImage(pickerResult.uri)
	}

	const shareImageAsync = async (): Promise<void> => {
		if (!await ImageSharing.isAvailableAsync()) {
			const userInput = confirm('Oops! Sharing isn\'t available on this platform.\n\nWould you like to use a fileserver alternative?')
			if (Platform.OS === 'web' && userInput) {
				// If user clicks on OK in the confirm box
				const remotePath = await uploadToAnonymousFilesAsync(selectedImage)
				// Set local state
				setFileServerUri(remotePath)
				alert(`Your file is located here:\n\n${remotePath}`)
			}
			return
		}
		ImageSharing.shareAsync(selectedImage)
	}

	const resetImageShare = (): void => {
		setSelectedImage('')
		setFileServerUri('')
	}

	let imageEl = (<Image source={logo} style={styles.logo}/>)
	if (selectedImage) {
		imageEl = (<Image source={{ uri: selectedImage }} style={styles.thumbnail} />)
	}

  return (
    <View style={styles.container}>
			{imageEl}
			<Text style={styles.instructions}>
				{selectedImage ? 'Now press the button below to share your photo with a friend!' : 'Click the button below to pick a photo from your gallery'}
			</Text>
			{!selectedImage ? (
				<Button
					onPress={openImagePickerAsync}
					style={styles.button}
					text='Pick a photo'
				/>
			) : (<>
				<View style={styles.shareAndNavContainer}>
					<Button
						onPress={shareImageAsync}
						style={styles.button}
						disabled={!!fileServerUri}
						text='Share'
					/>
					{fileServerUri ? (<Button
							style={styles.iconButton}
							onPress={() => window.open(fileServerUri, '_blank')}
							icon='external-link'
						>
					</Button>) : null}
				</View>
				<Button
					onPress={resetImageShare}
					style={styles.button}
					text='Reset image'
				/>
			</>)}
    </View>
  );
}

const buttonStyles = {
	backgroundColor: 'blue',
	padding: 20,
	borderRadius: 5,
	margin: 10
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
		backgroundColor: '#fff',
    alignItems: 'center',
		justifyContent: 'center',
		width: '100%'
	},
	logo: {
		width: 305,
		height: 159,
		marginBottom: 10
	},
	thumbnail: {
		width: 300,
		height: 300,
		resizeMode: 'contain'
	},
	instructions: {
		color: '#888',
		fontSize: 18,
		marginHorizontal: 15
	},
	button: {
		...buttonStyles
	},
	buttonText: {
		fontSize: 20,
		color: '#fff'
	},
	shareAndNavContainer: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	iconButton: {
		position: 'relative',
		top: 20
	}
})

export default App
