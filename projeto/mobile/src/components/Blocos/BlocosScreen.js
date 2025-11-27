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
  Text,
  Snackbar,
  IconButton,
  Menu,
  Divider,
} from 'react-native-paper';
// import DateTimePicker from '@react-native-community/datetimepicker';
import blocoService from '../../services/blocoService';

/**
 * Tela de gerenciamento de blocos de horários
 * @component
 */
const BlocosScreen = ({ navigation }) => {
  const [blocos, setBlocos] = useState([]);
  const [filteredBlocos, setFilteredBlocos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingBloco, setEditingBloco] = useState(null);
  const [formData, setFormData] = useState({
    turno: '',
    diaSemana: '',
    inicio: '',
    fim: '',
    ordem: ''
  });
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  // Estados para pickers
  const [turnoMenuVisible, setTurnoMenuVisible] = useState(false);
  const [diaSemanaMenuVisible, setDiaSemanaMenuVisible] = useState(false);

  const turnos = ['Manhã', 'Tarde', 'Noite', 'Integral'];
  const diasSemana = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

  /**
   * Carrega lista de blocos
   * @async
   * @function carregarBlocos
   */
  const carregarBlocos = async () => {
    try {
      setLoading(true);
      const data = await blocoService.getAll();
      // Ordenar por turno e depois por ordem
      const blocosOrdenados = data.sort((a, b) => {
        if (a.turno !== b.turno) {
          return turnos.indexOf(a.turno) - turnos.indexOf(b.turno);
        }
        return a.ordem - b.ordem;
      });
      setBlocos(blocosOrdenados);
      setFilteredBlocos(blocosOrdenados);
    } catch (error) {
      mostrarSnackbar('Erro ao carregar blocos de horários');
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
    await carregarBlocos();
    setRefreshing(false);
  };

  /**
   * Filtra blocos por busca
   * @function filtrarBlocos
   * @param {string} query - Texto de busca
   */
  const filtrarBlocos = (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredBlocos(blocos);
      return;
    }

    const filtered = blocos.filter(bloco =>
      bloco.turno.toLowerCase().includes(query.toLowerCase()) ||
      bloco.diaSemana.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredBlocos(filtered);
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
   * Abre modal para criar/editar bloco
   * @function abrirModal
   * @param {Object|null} bloco - Bloco para edição ou null para criação
   */
  const abrirModal = (bloco = null) => {
    if (bloco) {
      setEditingBloco(bloco);
      setFormData({
        turno: bloco.turno,
        diaSemana: bloco.diaSemana,
        inicio: bloco.inicio,
        fim: bloco.fim,
        ordem: bloco.ordem.toString()
      });
    } else {
      setEditingBloco(null);
      setFormData({
        turno: '',
        diaSemana: '',
        inicio: '',
        fim: '',
        ordem: ''
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
    setEditingBloco(null);
    setFormData({
      turno: '',
      diaSemana: '',
      inicio: '',
      fim: '',
      ordem: ''
    });
  };



  /**
   * Converte horário para minutos
   * @function horarioParaMinutos
   * @param {string} horario - Horário no formato HH:mm
   * @returns {number} Minutos desde 00:00
   */
  const horarioParaMinutos = (horario) => {
    const [horas, minutos] = horario.split(':').map(Number);
    return horas * 60 + minutos;
  };

  /**
   * Valida formulário
   * @function validarFormulario
   * @returns {boolean} True se válido
   */
  const validarFormulario = () => {
    if (!formData.turno) {
      mostrarSnackbar('Turno é obrigatório');
      return false;
    }

    if (!formData.diaSemana) {
      mostrarSnackbar('Dia da semana é obrigatório');
      return false;
    }

    if (!formData.inicio) {
      mostrarSnackbar('Horário de início é obrigatório');
      return false;
    }

    if (!formData.fim) {
      mostrarSnackbar('Horário de fim é obrigatório');
      return false;
    }

    const inicioMinutos = horarioParaMinutos(formData.inicio);
    const fimMinutos = horarioParaMinutos(formData.fim);

    if (inicioMinutos >= fimMinutos) {
      Alert.alert(
        'Horário Inválido',
        'O horário de início deve ser anterior ao horário de fim.',
        [{ text: 'OK' }]
      );
      return false;
    }

    const ordem = parseInt(formData.ordem);
    if (!ordem || ordem < 1) {
      mostrarSnackbar('Ordem deve ser um número positivo');
      return false;
    }

    return true;
  };

  /**
   * Salva bloco (criar ou atualizar)
   * @async
   * @function salvarBloco
   */
  const salvarBloco = async () => {
    if (!validarFormulario()) return;

    try {
      setLoading(true);
      const dadosBloco = {
        turno: formData.turno,
        diaSemana: formData.diaSemana,
        inicio: formData.inicio,
        fim: formData.fim,
        ordem: parseInt(formData.ordem)
      };

      if (editingBloco) {
        await blocoService.update(editingBloco._id, dadosBloco);
        mostrarSnackbar('Bloco atualizado com sucesso');
      } else {
        await blocoService.create(dadosBloco);
        mostrarSnackbar('Bloco criado com sucesso');
      }

      fecharModal();
      carregarBlocos();
    } catch (error) {
      let message = 'Erro ao salvar bloco';
      
      if (error.response?.status === 409) {
        message = 'Já existe um bloco com o mesmo Turno, Dia e Ordem.';
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      }
      
      mostrarSnackbar(message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Remove bloco com confirmação
   * @async
   * @function removerBloco
   * @param {Object} bloco - Bloco a ser removido
   */
  const removerBloco = (bloco) => {
    Alert.alert(
      'Confirmar Exclusão',
      `Tem certeza que deseja remover o bloco "${bloco.turno} - ${bloco.diaSemana}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await blocoService.delete(bloco._id);
              mostrarSnackbar('Bloco removido com sucesso');
              carregarBlocos();
            } catch (error) {
              const message = error.response?.data?.message || 'Erro ao remover bloco';
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
   * @function renderBloco
   * @param {Object} item - Item do bloco
   * @returns {JSX.Element} Card do bloco
   */
  const renderBloco = ({ item }) => (
    <Card style={{ margin: 8, elevation: 2 }}>
      <Card.Content>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View style={{ flex: 1 }}>
            <Title>{item.turno} - {item.diaSemana}</Title>
            <Paragraph>Horário: {item.inicio} às {item.fim}</Paragraph>
            <Paragraph>Ordem: {item.ordem}</Paragraph>
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
              onPress={() => removerBloco(item)}
            />
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  useEffect(() => {
    carregarBlocos();
  }, []);

  useEffect(() => {
    filtrarBlocos(searchQuery);
  }, [blocos]);

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Blocos de Horários" />
      </Appbar.Header>

      <View style={{ padding: 16 }}>
        <Searchbar
          placeholder="Buscar por turno ou dia da semana..."
          onChangeText={filtrarBlocos}
          value={searchQuery}
          style={{ marginBottom: 16 }}
        />
      </View>

      <FlatList
        data={filteredBlocos}
        renderItem={renderBloco}
        keyExtractor={(item) => item._id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={{ padding: 32, alignItems: 'center' }}>
            <Text>Nenhum bloco encontrado</Text>
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
            <Title>{editingBloco ? 'Editar Bloco' : 'Novo Bloco'}</Title>

            {/* Campo Turno */}
            <Menu
              visible={turnoMenuVisible}
              onDismiss={() => setTurnoMenuVisible(false)}
              anchor={
                <Button
                  mode="outlined"
                  onPress={() => setTurnoMenuVisible(true)}
                  style={{ marginBottom: 16 }}
                >
                  {formData.turno || 'Selecionar Turno *'}
                </Button>
              }
            >
              {turnos.map(turno => (
                <Menu.Item
                  key={turno}
                  onPress={() => {
                    setFormData({ ...formData, turno });
                    setTurnoMenuVisible(false);
                  }}
                  title={turno}
                />
              ))}
            </Menu>

            {/* Campo Dia da Semana */}
            <Menu
              visible={diaSemanaMenuVisible}
              onDismiss={() => setDiaSemanaMenuVisible(false)}
              anchor={
                <Button
                  mode="outlined"
                  onPress={() => setDiaSemanaMenuVisible(true)}
                  style={{ marginBottom: 16 }}
                >
                  {formData.diaSemana || 'Selecionar Dia da Semana *'}
                </Button>
              }
            >
              {diasSemana.map(dia => (
                <Menu.Item
                  key={dia}
                  onPress={() => {
                    setFormData({ ...formData, diaSemana: dia });
                    setDiaSemanaMenuVisible(false);
                  }}
                  title={dia}
                />
              ))}
            </Menu>

            {/* Campo Início */}
            <TextInput
              label="Horário de Início *"
              value={formData.inicio}
              onChangeText={(text) => setFormData({ ...formData, inicio: text })}
              placeholder="HH:mm"
              style={{ marginBottom: 16 }}
              mode="outlined"
            />

            {/* Campo Fim */}
            <TextInput
              label="Horário de Fim *"
              value={formData.fim}
              onChangeText={(text) => setFormData({ ...formData, fim: text })}
              placeholder="HH:mm"
              style={{ marginBottom: 16 }}
              mode="outlined"
            />

            {/* Campo Ordem */}
            <TextInput
              label="Ordem *"
              value={formData.ordem}
              onChangeText={(text) => setFormData({ ...formData, ordem: text })}
              keyboardType="numeric"
              style={{ marginBottom: 24 }}
              mode="outlined"
            />

            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8 }}>
              <Button onPress={fecharModal}>Cancelar</Button>
              <Button
                mode="contained"
                onPress={salvarBloco}
                loading={loading}
                disabled={loading}
              >
                {editingBloco ? 'Atualizar' : 'Criar'}
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

export default BlocosScreen;