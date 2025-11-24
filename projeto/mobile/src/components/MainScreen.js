import React from 'react';
import { View } from 'react-native';
import {
  Appbar,
  List,
  Card,
  Title,
  Paragraph,
} from 'react-native-paper';

/**
 * Tela principal com menu de navegação
 * @component
 */
const MainScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.Content title="Sistema de Laboratórios" />
      </Appbar.Header>

      <View style={{ padding: 16 }}>
        <Card style={{ marginBottom: 16 }}>
          <Card.Content>
            <Title>Bem-vindo!</Title>
            <Paragraph>
              Sistema de gerenciamento de laboratórios PM2025-2
            </Paragraph>
          </Card.Content>
        </Card>

        <List.Section>
          <List.Subheader>Módulos</List.Subheader>
          
          <List.Item
            title="Instituições"
            description="Gerenciar instituições de ensino"
            left={props => <List.Icon {...props} icon="domain" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => navigation.navigate('Instituicoes')}
          />
          
          <List.Item
            title="Cursos"
            description="Gerenciar cursos das instituições"
            left={props => <List.Icon {...props} icon="school" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => navigation.navigate('Cursos')}
          />
          
          <List.Item
            title="Professores"
            description="Gerenciar professores do sistema"
            left={props => <List.Icon {...props} icon="account-tie" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => navigation.navigate('Professores')}
          />
        </List.Section>
      </View>
    </View>
  );
};

export default MainScreen;