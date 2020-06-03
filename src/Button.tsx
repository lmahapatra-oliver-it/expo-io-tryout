import React from 'react'
import { TouchableOpacity, StyleSheet, Text } from 'react-native'
import { Icon } from 'react-native-elements'

interface ButtonProps {
	style: object,
	onPress: () => void,
	text?: string,
	icon?: string
	disabled?: boolean
}

const Button: React.FC<ButtonProps> = ({ style, onPress, text, icon, disabled }) => {
		if (!text && !icon) {
			return null
		}

		return (
			<TouchableOpacity
				style={style}
				onPress={onPress}
				disabled={disabled}
			>
				{text ? (<Text style={styles.buttonText}>{text}</Text>) : null}
				{icon ? (<Icon
					name={icon}
					type='font-awesome'
					color='#f50'
					size={48}
				/>) : null}
			</TouchableOpacity>
		)
}

const styles = StyleSheet.create({
	buttonText: {
		fontSize: 20,
		color: '#fff'
	}
})

export default Button
