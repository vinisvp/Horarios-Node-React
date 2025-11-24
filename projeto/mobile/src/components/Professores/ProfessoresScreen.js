import React, { useState, useEffect } from 'react';
import { View, ScrollView, Alert, RefreshControl, KeyboardAvoidingView, Platform } from 'react-native';
import {
  Appbar,
  FAB,
  Searchbar,
  Card,
  Title,
  Paragraph,
  Chip,
  IconButton,
  Snackbar,
  Portal,
  Dialog,
  Button,
  TextInput,
  Switch,
  Text,
} from 'react-native-paper';
import { professoresService } from '../../services/api';

/**
 * Tela de gerenciamento de professores
 * @component
 */
const ProfessoresScreen = ({ navigation }) => {
  const [professores, setProfessores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filtro, setFiltro] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    status: 'Ativo',
  });

  /**
   * Carrega a lista de professores
   */
  const carregarProfessores = async () => {
    setLoading(true);
    try {
      const response = await professoresService.listar();
      const data = response.data?.professores || [];
      setProfessores(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erro ao carregar professores:', error);
      mostrarSnackbar('Erro ao carregar professores');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Atualiza a lista com pull to refresh
   */
  const onRefresh = async () => {
    setRefreshing(true);
    await carregarProfessores();
    setRefreshing(false);
  };

  /**
   * Exibe mensagem no snackbar
   * @param {string} message - Mensagem a ser exibida
   */
  const mostrarSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  /**
   * Valida o formato do email
   * @param {string} email - Email a ser validado
   * @returns {boolean} True se o email é válido
   */
  const validarEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  /**
   * Valida os dados do formulário
   * @returns {boolean} True se todos os dados são válidos
   */
  const validarFormulario = () => {
    const newErrors = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!validarEmail(formData.email)) {
      newErrors.email = 'Formato de email inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Formata o telefone com máscara
   * @param {string} value - Valor do telefone
   * @returns {string} Telefone formatado
   */
  const formatarTelefone = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  /**
   * Abre o dialog para criar/editar professor
   * @param {Object|null} professor - Professor a ser editado ou null para novo
   */
  const abrirDialog = (professor = null) => {
    if (professor) {
      setEditingId(professor._id);
      setFormData({
        nome: professor.nome || '',
        email: professor.email || '',
        telefone: professor.telefone || '',
        status: professor.status || 'Ativo',
      });
    } else {
      setEditingId(null);
      setFormData({
        nome: '',
        email: '',
        telefone: '',
        status: 'Ativo',
      });
    }
    setErrors({});
    setDialogVisible(true);
  };

  /**
   * Fecha o dialog
   */
  const fecharDialog = () => {
    setDialogVisible(false);
    setEditingId(null);
    setErrors({});
  };

  /**
   * Salva o professor (criar ou atualizar)
   */
  const salvarProfessor = async () => {
    if (!validarFormulario()) {
      return;
    }

    try {
      if (editingId) {
        await professoresService.atualizar(editingId, formData);
        mostrarSnackbar('Professor atualizado com sucesso');
      } else {
        await professoresService.criar(formData);
        mostrarSnackbar('Professor criado com sucesso');
      }
      fecharDialog();
      carregarProfessores();
    } catch (error) {
      if (error.response?.status === 409) {
        Alert.alert('Erro', 'Este email já está cadastrado');
      } else if (error.response?.status >= 400 && error.response?.status < 500) {
        Alert.alert('Erro', 'Dados inválidos. Verifique as informações e tente novamente.');
      } else if (error.response?.status >= 500) {
        Alert.alert('Erro', 'Erro interno do servidor. Tente novamente mais tarde.');
      } else {
        const message = error.response?.data?.message || 'Erro ao salvar professor';
        mostrarSnackbar(message);
      }
    }
  };

  /**
   * Remove um professor
   * @param {string} id - ID do professor
   */
  const removerProfessor = (id) => {
    Alert.alert(
      'Confirmar Remoção',
      'Tem certeza que deseja remover este professor?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            try {
              await professoresService.remover(id);
              mostrarSnackbar('Professor removido com sucesso');
              carregarProfessores();
            } catch (error) {
              if (error.response?.status === 404) {
                Alert.alert('Erro', 'Professor não encontrado');
              } else if (error.response?.status >= 500) {
                Alert.alert('Erro', 'Erro interno do servidor. Tente novamente mais tarde.');
              } else {
                const message = error.response?.data?.message || 'Erro ao remover professor';
                mostrarSnackbar(message);
              }
            }
          },
        },
      ]
    );
  };

  /**
   * Filtra professores por nome ou email
   */
  const professoresFiltrados = professores.filter((professor) =>
    professor.nome?.toLowerCase().includes(filtro.toLowerCase()) ||
    professor.email?.toLowerCase().includes(filtro.toLowerCase())
  );

  useEffect(() => {
    carregarProfessores();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Professores" />
      </Appbar.Header>

      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
        showsVerticalScrollIndicator={true}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Searchbar
          placeholder="Filtrar por nome ou email..."
          onChangeText={setFiltro}
          value={filtro}
          style={{ marginBottom: 16 }}
        />
        {professoresFiltrados.map((professor) => (
          <Card key={professor._id} style={{ marginBottom: 12 }}>
            <Card.Content>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <View style={{ flex: 1 }}>
                  <Title>{professor.nome}</Title>
                  <Paragraph>Email: {professor.email}</Paragraph>
                  {professor.telefone && (
                    <Paragraph>Telefone: {professor.telefone}</Paragraph>
                  )}
                  <Chip
                    mode="outlined"
                    style={{ 
                      alignSelf: 'flex-start', 
                      marginTop: 8,
                      backgroundColor: professor.status === 'Ativo' ? '#e8f5e8' : '#ffeaea'
                    }}
                  >
                    {professor.status || 'Inativo'}
                  </Chip>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <IconButton
                    icon="pencil"
                    mode="contained"
                    onPress={() => abrirDialog(professor)}
                  />
                  <IconButton
                    icon="delete"
                    mode="contained"
                    iconColor="#d32f2f"
                    onPress={() => removerProfessor(professor._id)}
                  />
                </View>
              </View>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>

      <FAB
        icon="plus"
        style={{
          position: 'absolute',
          margin: 16,
          right: 0,
          bottom: 0,
        }}
        onPress={() => abrirDialog()}
      />

      <Portal>
        <Dialog visible={dialogVisible} onDismiss={fecharDialog}>
          <Dialog.Title>
            {editingId ? 'Editar Professor' : 'Novo Professor'}
          </Dialog.Title>
          <Dialog.ScrollArea>
            <ScrollView contentContainerStyle={{ paddingHorizontal: 24 }}>
              <TextInput
                label="Nome *"
                value={formData.nome}
                onChangeText={(text) => setFormData({ ...formData, nome: text })}
                mode="outlined"
                style={{ marginBottom: 12 }}
                error={!!errors.nome}
              />
              {errors.nome && (
                <Text style={{ color: '#d32f2f', fontSize: 12, marginBottom: 8 }}>
                  {errors.nome}
                </Text>
              )}
              
              <TextInput
                label="Email *"
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
                mode="outlined"
                keyboardType="email-address"
                autoCapitalize="none"
                style={{ marginBottom: 12 }}
                error={!!errors.email}
              />
              {errors.email && (
                <Text style={{ color: '#d32f2f', fontSize: 12, marginBottom: 8 }}>
                  {errors.email}
                </Text>
              )}
              
              <TextInput
                label="Telefone"
                value={formData.telefone}
                onChangeText={(text) => {
                  const formatted = formatarTelefone(text);
                  setFormData({ ...formData, telefone: formatted });
                }}
                mode="outlined"
                keyboardType="phone-pad"
                placeholder="(XX) XXXXX-XXXX"
                style={{ marginBottom: 12 }}
              />
              
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                <Text>Ativo: </Text>
                <Switch
                  value={formData.status === 'Ativo'}
                  onValueChange={(value) => setFormData({ ...formData, status: value ? 'Ativo' : 'Inativo' })}
                />
              </View>
            </ScrollView>
          </Dialog.ScrollArea>
          <Dialog.Actions>
            <Button onPress={fecharDialog}>Cancelar</Button>
            <Button onPress={salvarProfessor} mode="contained">
              {editingId ? 'Atualizar' : 'Criar'}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={4000}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
};

export default ProfessoresScreen;