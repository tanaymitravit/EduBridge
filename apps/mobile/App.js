import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, Button, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const API = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000';

export default function App() {
  const [message, setMessage] = useState('Explain recursion simply');
  const [reply, setReply] = useState('');

  async function ask() {
    const res = await fetch(`${API}/api/ai/chat`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message }) });
    const data = await res.json();
    setReply(data.reply || '');
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: '700', marginBottom: 12 }}>EduBridge Mobile</Text>
        <Text>AI Buddy</Text>
        <TextInput value={message} onChangeText={setMessage} style={{ borderWidth: 1, borderColor: '#CBD5E1', padding: 8, backgroundColor: 'white' }} />
        <View style={{ height: 8 }} />
        <Button title="Ask" onPress={ask} />
        <View style={{ height: 12 }} />
        <Text selectable style={{ backgroundColor: 'white', padding: 8, borderWidth: 1, borderColor: '#E5E7EB' }}>{reply}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}


