import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import MainScreen from './src/components/MainScreen';
import InstituicoesScreen from './src/components/Instituicoes/InstituicoesScreen';
import CursosScreen from './src/components/Cursos/CursosScreen';
import ProfessoresScreen from './src/components/Professores/ProfessoresScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Main"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen 
            name="Main" 
            component={MainScreen}
            options={{ title: 'Sistema de Laboratórios' }}
          />
          <Stack.Screen 
            name="Instituicoes" 
            component={InstituicoesScreen}
            options={{ title: 'Gerenciamento de Instituições' }}
          />
          <Stack.Screen 
            name="Cursos" 
            component={CursosScreen}
            options={{ title: 'Gerenciamento de Cursos' }}
          />
          <Stack.Screen 
            name="Professores" 
            component={ProfessoresScreen}
            options={{ title: 'Gerenciamento de Professores' }}
          />
        </Stack.Navigator>
        <StatusBar style="auto" />
      </NavigationContainer>
    </PaperProvider>
  );
}
