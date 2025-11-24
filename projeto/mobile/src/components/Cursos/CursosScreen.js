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
  Menu,
  Divider,
} from 'react-native-paper';
import { cursosService, instituicoesService } from '../../services/api';

/**
 * Tela de gerenciamento de cursos
 * @component
 */
const CursosScreen = ({ navigation }) => {
  const [cursos, setCursos] = useState([]);
  const [instituicoes, setInstituicoes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filtro, setFiltro] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);
  
  const [formData, setFormData] = useState({
    nome: '',
    instituicaoId: '',
    turnos: [],
    ativo: true,
  });

  const turnosDisponiveis = ['Manhã', 'Tarde', 'Noite', 'Integral'];

  /**
   * Carrega lista de cursos
   */
  const carregarCursos = async () => {
    setLoading(true);
    try {
      const response = await cursosService.listar();
      setCursos(response.data.cursos || response.data);
    } catch (error) {
      console.error('Erro ao carregar cursos:', error);
      mostrarSnackbar('Erro ao carregar cursos');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Carrega lista de instituições
   */
  const carregarInstituicoes = async () => {
    try {
      const response = await instituicoesService.listar();
      setInstituicoes(response.data);
    } catch (error) {
      console.error('Erro ao carregar instituições:', error);
      mostrarSnackbar('Erro ao carregar instituições');
    }
  };

  /**
   * Pull to refresh
   */
  const onRefresh = async () => {
    setRefreshing(true);
    await carregarCursos();
    setRefreshing(false);
  };

  /**
   * Exibe snackbar
   */
  const mostrarSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  /**
   * Abre dialog para criar/editar
   */
  const abrirDialog = async (curso = null) => {
    await carregarInstituicoes();
    
    if (curso) {
      setEditingId(curso._id);
      setFormData({
        nome: curso.nome || '',
        instituicaoId: curso.instituicaoId?._id || curso.instituicaoId || '',
        turnos: curso.turnos || [],
        ativo: curso.ativo !== undefined ? curso.ativo : true,
      });
    } else {
      setEditingId(null);
      setFormData({
        nome: '',
        instituicaoId: '',
        turnos: [],
        ativo: true,
      });
    }
    setDialogVisible(true);
  };

  /**
   * Fecha dialog
   */
  const fecharDialog = () => {
    setDialogVisible(false);
    setEditingId(null);
  };

  /**
   * Salva curso
   */
  const salvarCurso = async () => {
    if (!formData.nome.trim() || !formData.instituicaoId) {
      mostrarSnackbar('Nome e instituição são obrigatórios');
      return;
    }

    try {
      if (editingId) {
        await cursosService.atualizar(editingId, formData);
        mostrarSnackbar('Curso atualizado com sucesso');
      } else {
        await cursosService.criar(formData);
        mostrarSnackbar('Curso criado com sucesso');
      }
      fecharDialog();
      carregarCursos();
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao salvar curso';
      mostrarSnackbar(message);
    }
  };

  /**
   * Remove curso
   */
  const removerCurso = (id) => {
    console.log('Tentando remover curso:', id);
    Alert.alert(
      'Confirmar Remoção',
      'Tem certeza que deseja remover este curso?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('Chamando API para remover curso:', id);
              const response = await cursosService.remover(id);
              console.log('Resposta da API:', response);
              mostrarSnackbar('Curso removido com sucesso');
              carregarCursos();
            } catch (error) {
              console.error('Erro ao remover curso:', error);
              const message = error.response?.data?.message || error.message || 'Erro ao remover curso';
              mostrarSnackbar(message);
            }
          },
        },
      ]
    );
  };

  /**
   * Alterna seleção de turno
   */
  const toggleTurno = (turno) => {
    const newTurnos = formData.turnos.includes(turno)
      ? formData.turnos.filter(t => t !== turno)
      : [...formData.turnos, turno];
    setFormData({ ...formData, turnos: newTurnos });
  };

  /**
   * Obtém nome da instituição
   */
  const getNomeInstituicao = (instituicaoData) => {
    if (typeof instituicaoData === 'object' && instituicaoData?.nome) {
      return instituicaoData.nome;
    }
    const instituicao = instituicoes.find(inst => inst._id === instituicaoData);
    return instituicao ? instituicao.nome : 'N/A';
  };

  /**
   * Filtra cursos
   */
  const cursosFiltrados = cursos.filter((curso) =>
    curso.nome?.toLowerCase().includes(filtro.toLowerCase()) ||
    getNomeInstituicao(curso.instituicaoId).toLowerCase().includes(filtro.toLowerCase())
  );

  useEffect(() => {
    carregarCursos();
  }, []);

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Cursos" />
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
          placeholder="Filtrar cursos..."
          onChangeText={setFiltro}
          value={filtro}
          style={{ marginBottom: 16 }}
        />
        {cursosFiltrados.map((curso) => (
          <Card key={curso._id} style={{ marginBottom: 12 }}>
            <Card.Content>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <View style={{ flex: 1 }}>
                  <Title>{curso.nome}</Title>
                  <Paragraph>Instituição: {getNomeInstituicao(curso.instituicaoId)}</Paragraph>
                  <Paragraph>Turnos: {curso.turnos?.join(', ') || 'N/A'}</Paragraph>
                  <Chip
                    mode="outlined"
                    style={{ 
                      alignSelf: 'flex-start', 
                      marginTop: 8,
                      backgroundColor: curso.ativo ? '#e8f5e8' : '#ffeaea'
                    }}
                  >
                    {curso.ativo ? 'Ativo' : 'Inativo'}
                  </Chip>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <IconButton
                    icon="pencil"
                    mode="contained"
                    onPress={() => abrirDialog(curso)}
                  />
                  <IconButton
                    icon="delete"
                    mode="contained"
                    iconColor="#d32f2f"
                    onPress={() => removerCurso(curso._id)}
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
            {editingId ? 'Editar Curso' : 'Novo Curso'}
          </Dialog.Title>
          <Dialog.ScrollArea>
            <ScrollView contentContainerStyle={{ paddingHorizontal: 24 }}>
              <TextInput
                label="Nome *"
                value={formData.nome}
                onChangeText={(text) => setFormData({ ...formData, nome: text })}
                mode="outlined"
                style={{ marginBottom: 12 }}
              />

              <View style={{ marginBottom: 12 }}>
                <Text style={{ marginBottom: 8, fontSize: 16, fontWeight: 'bold' }}>
                  Instituição *
                </Text>
                <Menu
                  visible={menuVisible}
                  onDismiss={() => setMenuVisible(false)}
                  anchor={
                    <Button
                      mode="outlined"
                      onPress={() => setMenuVisible(true)}
                      style={{ justifyContent: 'flex-start' }}
                    >
                      {formData.instituicaoId 
                        ? instituicoes.find(i => i._id === formData.instituicaoId)?.nome || 'Selecionar...'
                        : 'Selecionar instituição...'
                      }
                    </Button>
                  }
                >
                  {instituicoes.map((instituicao) => (
                    <Menu.Item
                      key={instituicao._id}
                      onPress={() => {
                        setFormData({ ...formData, instituicaoId: instituicao._id });
                        setMenuVisible(false);
                      }}
                      title={instituicao.nome}
                    />
                  ))}
                </Menu>
              </View>

              <View style={{ marginBottom: 12 }}>
                <Text style={{ marginBottom: 8, fontSize: 16, fontWeight: 'bold' }}>
                  Turnos
                </Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                  {turnosDisponiveis.map((turno) => (
                    <Chip
                      key={turno}
                      selected={formData.turnos.includes(turno)}
                      onPress={() => toggleTurno(turno)}
                      mode={formData.turnos.includes(turno) ? 'flat' : 'outlined'}
                      style={{ margin: 2 }}
                    >
                      {turno}
                    </Chip>
                  ))}
                </View>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                <Text>Ativo: </Text>
                <Switch
                  value={formData.ativo}
                  onValueChange={(value) => setFormData({ ...formData, ativo: value })}
                />
              </View>
            </ScrollView>
          </Dialog.ScrollArea>
          <Dialog.Actions>
            <Button onPress={fecharDialog}>Cancelar</Button>
            <Button onPress={salvarCurso} mode="contained">
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
    </KeyboardAvoidingView>
  );
};

export default CursosScreen;