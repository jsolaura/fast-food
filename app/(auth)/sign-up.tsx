import CustomButton from '@/components/CustomButton';
import CustomInput from '@/components/CustomInput';
import { createUser } from '@/lib/appwrite';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import { Alert, Text, View } from 'react-native';

const SignUp = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });
  
  const submit = async () => {
    const { name, email, password } = form;

    if(!name || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    setIsSubmitting(true);

    try {
      await createUser({
        name,
        email,
        password,
      });

      Alert.alert('Success', 'Sign Up Successful');
      router.replace('/');

    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <View className="gap-10 bg-white rounded-lg p-5 mt-5">
      <CustomInput
        value={form.name}
        onChangeText={(text) => setForm({ ...form, name: text })}
        label="Full Name"
        placeholder="Enter your name"
      />
      <CustomInput
        value={form.email}
        onChangeText={(text) => setForm({ ...form, email: text })}
        label="Email"
        placeholder="Enter your email"
        keyboardType="email-address"
      />
      <CustomInput
        value={form.password}
        onChangeText={(text) => setForm({ ...form, password: text })}
        label="Password"
        placeholder="Enter your password"
        secureTextEntry={true}
      />
      <CustomButton 
        onPress={submit}
        title="Sign Up"
        isLoading={isSubmitting}
      />
      <View className="flex justify-center flex-row mt-5 gap-2">
        <Text className="base-regular text-gray-100">Already have an account?</Text>
        <Link href="/sign-in" className="base-bold text-primary">Sign In</Link>
      </View>
    </View>
  )
}

export default SignUp;