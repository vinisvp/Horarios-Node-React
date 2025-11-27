import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  RefreshControl,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  Appbar,
  Card,
  Title,
  Paragraph,
  FAB,
  Searchbar,
  Portal,
  Modal,
  TextInput,
  Button,
  Switch,
  Text,
  Snackbar,
  IconButton,
  Chip,
} from 'react-native-paper';
import laboratorioService from '../../services/laboratorioService';

/**
 * Tela de gerenciamento de laboratórios
 * @component
 */
const LaboratoriosScreen = ({ navigation }) => {
  const [laboratorios, setLaboratorios] = useState([]);
  const [filteredLaboratorios, setFilteredLaboratorios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingLaboratorio, setEditingLaboratorio] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    capacidade: '',
    local: '',
    status: true
  });
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  /**
   * Carrega lista de laboratórios
   * @async
   * @function carregarLaboratorios
   */
  const carregarLaboratorios = async () => {
    try {
      setLoading(true);
      const data = await laboratorioService.getAll();
      setLaboratorios(data);
      setFilteredLaboratorios(data);
    } catch (error) {
      mostrarSnackbar('Erro ao carregar laboratórios');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Atualiza lista com pull to refresh
   * @async
   * @function onRefresh
   */
  const onRefresh = async () => {
    setRefreshing(true);
    await carregarLaboratorios();
    setRefreshing(false);
  };

  /**
   * Filtra laboratórios por busca
   * @function filtrarLaboratorios
   * @param {string} query - Texto de busca
   */
  const filtrarLaboratorios = (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredLaboratorios(laboratorios);
      return;
    }

    const filtered = laboratorios.filter(lab =>
      lab.nome.toLowerCase().includes(query.toLowerCase()) ||
      (lab.local && lab.local.toLowerCase().includes(query.toLowerCase()))
    );
    setFilteredLaboratorios(filtered);
  };

  /**
   * Mostra mensagem no snackbar
   * @function mostrarSnackbar
   * @param {string} message - Mensagem a ser exibida
   */
  const mostrarSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  /**
   * Abre modal para criar/editar laboratório
   * @function abrirModal
   * @param {Object|null} laboratorio - Laboratório para edição ou null para criação
   */
  const abrirModal = (laboratorio = null) => {
    if (laboratorio) {
      setEditingLaboratorio(laboratorio);
      setFormData({
        nome: laboratorio.nome,
        capacidade: laboratorio.capacidade.toString(),
        local: laboratorio.local || '',
        status: laboratorio.status === 'Ativo'
      });
    } else {
      setEditingLaboratorio(null);
      setFormData({
        nome: '',
        capacidade: '',
        local: '',
        status: true
      });
    }
    setModalVisible(true);
  };

  /**
   * Fecha modal
   * @function fecharModal
   */
  const fecharModal = () => {
    setModalVisible(false);
    setEditingLaboratorio(null);
    setFormData({
      nome: '',
      capacidade: '',
      local: '',
      status: true
    });
  };

  /**
   * Valida formulário
   * @function validarFormulario
   * @returns {boolean} True se válido
   */
  const validarFormulario = () => {
    if (!formData.nome.trim()) {
      mostrarSnackbar('Nome é obrigatório');
      return false;
    }

    const capacidade = parseInt(formData.capacidade);
    if (!capacidade || capacidade <= 0) {
      mostrarSnackbar('Capacidade deve ser um número maior que 0');
      return false;
    }

    return true;
  };

  /**
   * Salva laboratório (criar ou atualizar)
   * @async
   * @function salvarLaboratorio
   */
  const salvarLaboratorio = async () => {
    if (!validarFormulario()) return;

    try {
      setLoading(true);
      const dadosLaboratorio = {
        nome: formData.nome.trim(),
        capacidade: parseInt(formData.capacidade),
        local: formData.local.trim() || undefined,
        status: formData.status ? 'Ativo' : 'Inativo'
      };

      if (editingLaboratorio) {
        await laboratorioService.update(editingLaboratorio._id, dadosLaboratorio);
        mostrarSnackbar('Laboratório atualizado com sucesso');
      } else {
        await laboratorioService.create(dadosLaboratorio);
        mostrarSnackbar('Laboratório criado com sucesso');
      }

      fecharModal();
      carregarLaboratorios();
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao salvar laboratório';
      mostrarSnackbar(message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Remove laboratório com confirmação
   * @async
   * @function removerLaboratorio
   * @param {Object} laboratorio - Laboratório a ser removido
   */
  const removerLaboratorio = (laboratorio) => {
    Alert.alert(
      'Confirmar Exclusão',
      `Tem certeza que deseja remover o laboratório "${laboratorio.nome}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await laboratorioService.delete(laboratorio._id);
              mostrarSnackbar('Laboratório removido com sucesso');
              carregarLaboratorios();
            } catch (error) {
              const message = error.response?.data?.message || 'Erro ao remover laboratório';
              mostrarSnackbar(message);
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  /**
   * Renderiza item da lista
   * @function renderLaboratorio
   * @param {Object} item - Item do laboratório
   * @returns {JSX.Element} Card do laboratório
   */
  const renderLaboratorio = ({ item }) => (
    <Card style={{ margin: 8, elevation: 2 }}>
      <Card.Content>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View style={{ flex: 1 }}>
            <Title>{item.nome}</Title>
            <Paragraph>Capacidade: {item.capacidade} pessoas</Paragraph>
            {item.local && <Paragraph>Local: {item.local}</Paragraph>}
            <Chip
              mode="outlined"
              style={{ alignSelf: 'flex-start', marginTop: 8 }}
              textStyle={{ color: item.status === 'Ativo' ? '#4caf50' : '#757575' }}
            >
              {item.status}
            </Chip>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <IconButton
              icon="pencil"
              size={20}
              onPress={() => abrirModal(item)}
            />
            <IconButton
              icon="delete"
              size={20}
              iconColor="#f44336"
              onPress={() => removerLaboratorio(item)}
            />
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  useEffect(() => {
    carregarLaboratorios();
  }, []);

  useEffect(() => {
    filtrarLaboratorios(searchQuery);
  }, [laboratorios]);

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Laboratórios" />
      </Appbar.Header>

      <View style={{ padding: 16 }}>
        <Searchbar
          placeholder="Buscar por nome ou local..."
          onChangeText={filtrarLaboratorios}
          value={searchQuery}
          style={{ marginBottom: 16 }}
        />
      </View>

      <FlatList
        data={filteredLaboratorios}
        renderItem={renderLaboratorio}
        keyExtractor={(item) => item._id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={{ padding: 32, alignItems: 'center' }}>
            <Text>Nenhum laboratório encontrado</Text>
          </View>
        }
      />

      <FAB
        icon="plus"
        style={{
          position: 'absolute',
          margin: 16,
          right: 0,
          bottom: 0,
        }}
        onPress={() => abrirModal()}
      />

      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={fecharModal}
          contentContainerStyle={{
            backgroundColor: 'white',
            padding: 20,
            margin: 20,
            borderRadius: 8,
          }}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
          >
            <Title>{editingLaboratorio ? 'Editar Laboratório' : 'Novo Laboratório'}</Title>

            <TextInput
              label="Nome *"
              value={formData.nome}
              onChangeText={(text) => setFormData({ ...formData, nome: text })}
              style={{ marginBottom: 16 }}
              mode="outlined"
            />

            <TextInput
              label="Capacidade *"
              value={formData.capacidade}
              onChangeText={(text) => setFormData({ ...formData, capacidade: text })}
              keyboardType="numeric"
              style={{ marginBottom: 16 }}
              mode="outlined"
            />

            <TextInput
              label="Local"
              value={formData.local}
              onChangeText={(text) => setFormData({ ...formData, local: text })}
              placeholder="Ex: Bloco A - Sala 101"
              style={{ marginBottom: 16 }}
              mode="outlined"
            />

            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
              <Text style={{ flex: 1 }}>Status Ativo</Text>
              <Switch
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              />
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8 }}>
              <Button onPress={fecharModal}>Cancelar</Button>
              <Button
                mode="contained"
                onPress={salvarLaboratorio}
                loading={loading}
                disabled={loading}
              >
                {editingLaboratorio ? 'Atualizar' : 'Criar'}
              </Button>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </Portal>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
};

export default LaboratoriosScreen;