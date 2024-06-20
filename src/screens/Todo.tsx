import React, {useCallback, useEffect} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useTheme} from '../../ThemeContext';
import {fonts} from '../../constant';
import {
  addTodoItem,
  deleteTodoItem,
  getTodoItems,
  updateTodoItem,
} from '../../helper';
import ButtonComponent from '../components/ButtonComponent';
import {showToast} from '../components/Toast';

interface TodoItem {
  id: string;
  title: string;
  done: boolean;
}

const Todo = (): JSX.Element => {
  const {width, height} = useWindowDimensions();
  const {theme} = useTheme();
  const [validation, setValidation] = React.useState(false);
  const [todoItems, setTodoItems] = React.useState<Array<TodoItem>>([]);
  const [newTodoItem, setNewTodoItem] = React.useState('');
  const [reload, setReload] = React.useState(false);
  const [inProgress, setInProgress] = React.useState(false);
  const [pageNumber, setPageNumber] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(8);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [editTodoItem, setEditTodoItem] = React.useState('');
  const [updateTodo, setUpdateTodo] = React.useState<TodoItem>({
    id: '',
    title: '',
    done: false,
  });

  useEffect(() => {
    setInProgress(true);
    //setReload(true);
    getTodoItems(pageNumber, pageSize)
      .then(items => {
        if (pageNumber === 0) {
          setTodoItems(items);
        } else {
          setTodoItems(prevData => [...prevData, ...items]);
        }
        setInProgress(false);
        setReload(false);
      })
      .catch(error => {
        setReload(false);
        setInProgress(false);
        showToast('error', 'Something Went Wrong', '');
        console.log(error);
      });
  }, [pageNumber]);

  const renderFooter = () => {
    if (!reload) return null;
    return <ActivityIndicator style={{margin: 20}} />;
  };

  const loadMoreData = useCallback(() => {
    if (reload || inProgress) return;
    setReload(true);
    setPageNumber(prevPage => prevPage + 1);
    setReload(false);
  }, [reload, pageNumber]);

  return (
    <SafeAreaView
      style={{
        backgroundColor: theme.background,
      }}>
      <StatusBar
        barStyle={theme.statusBarContent}
        backgroundColor={theme.background}
      />
      <View style={{minHeight: height}}>
        <View style={{marginTop: 32, paddingHorizontal: 24}}>
          <Text
            style={{
              color: theme.text,
              fontFamily: fonts.medium,
              fontSize: 24,
            }}>
            TODO
          </Text>
        </View>
        <View style={{marginTop: 32, paddingHorizontal: 24}}>
          <Text
            style={{
              color: theme.text,
              fontFamily: fonts.medium,
              fontSize: 18,
            }}>
            Todo
          </Text>
          <TextInput
            style={{
              borderRadius: 6,
              borderWidth: 1,
              margin: 10,
              padding: 7,
              borderColor: theme.text,
              color: theme.text,
            }}
            placeholder="Add your todo item"
            onChange={e => setNewTodoItem(e.nativeEvent.text)}
            value={newTodoItem}
            placeholderTextColor={theme.text}
          />
          {validation && (
            <Text style={styles.errorMessage}>Please enter your todo item</Text>
          )}
          <ButtonComponent
            title="Add"
            onPress={() => {
              if (newTodoItem.length) {
                setValidation(false);
                setInProgress(true);
                addTodoItem(newTodoItem)
                  .then(() => {
                    setPageNumber(0);
                    getTodoItems(0, pageSize)
                      .then(items => {
                        setTodoItems(items);
                        setInProgress(false);
                        showToast('success', 'New Todo added successfully', '');
                      })
                      .catch(error => {
                        showToast('error', 'Something Went Wrong', '');
                        setInProgress(false);
                        console.log(error);
                      });
                  })
                  .catch(error => {
                    setInProgress(false);
                    showToast('error', 'Try Again', 'Random id error');
                    console.log(error);
                  });
                setNewTodoItem('');
              } else {
                setValidation(true);
              }
            }}
          />
        </View>
        <View
          style={{
            marginTop: 32,
            paddingHorizontal: 24,
            flex: 1,
            paddingBottom: '20%',
          }}>
          <FlatList
            data={todoItems}
            renderItem={({item}: any) => (
              <View
                key={item.id}
                style={{
                  borderBottomWidth: 1,
                  padding: 8,
                  borderBottomColor: theme.text,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{
                    marginTop: 8,
                    fontSize: 18,
                    fontFamily: fonts.regular,
                    color: theme.text,
                  }}>
                  {item.title}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity
                    style={{
                      marginRight: 10,
                      borderWidth: 1,
                      borderColor: theme.text,
                      borderRadius: 6,
                      padding: 5,
                    }}
                    onPress={() => {
                      setUpdateTodo(item);
                      setEditTodoItem(item.title);
                      setModalVisible(true);
                    }}>
                    <Text
                      style={{
                        color: theme.text,
                      }}>
                      Edit
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={async () => {
                      try {
                        setReload(true);
                        setInProgress(true);
                        await deleteTodoItem(item.id);
                        setPageNumber(0);
                        getTodoItems(0, pageSize)
                          .then(items => {
                            setTodoItems(items);
                            setInProgress(false);
                            setReload(false);
                          })
                          .catch(error => {
                            showToast('error', 'Something Went Wrong', '');
                            setInProgress(false);
                            setReload(false);
                            console.log(error);
                          });
                        setInProgress(false);
                      } catch (error) {
                        setInProgress(false);
                        showToast('error', 'Something Went Wrong', '');
                      }
                    }}
                    style={{
                      marginRight: 10,
                      borderWidth: 1,
                      borderColor: theme.text,
                      borderRadius: 6,
                      padding: 5,
                    }}>
                    <Text
                      style={{
                        color: theme.text,
                      }}>
                      Delete
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            keyExtractor={(item: any) => item.id}
            onRefresh={() => {
              setReload(true);
              setPageNumber(0);
              getTodoItems(0, pageSize)
                .then(items => {
                  setTodoItems(items);
                  setInProgress(false);
                  setReload(false);
                })
                .catch(error => {
                  showToast('error', 'Something Went Wrong', '');
                  setInProgress(false);
                  setReload(false);
                  console.log(error);
                });
            }}
            refreshing={reload}
            onEndReached={loadMoreData}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
          />
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setModalVisible(!modalVisible);
          }}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 22,
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
            }}>
            <View
              style={{
                backgroundColor: theme.background,
                borderRadius: 20,
                padding: 20,
                //alignItems: 'center',
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                elevation: 5,
                width: width - 100,
                height: width / 2.5,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    color: theme.text,
                    fontFamily: fonts.medium,
                    fontSize: 18,
                  }}>
                  Todo
                </Text>
                <Ionicons
                  name={'close'}
                  size={30}
                  color={theme.text}
                  onPress={() => setModalVisible(false)}
                />
              </View>
              <TextInput
                style={{
                  borderRadius: 6,
                  borderWidth: 1,
                  marginVertical: 10,
                  padding: 7,
                  borderColor: theme.text,
                  color: theme.text,
                  width: '100%',
                }}
                placeholder="Add your todo item"
                onChange={e => setEditTodoItem(e.nativeEvent.text)}
                value={editTodoItem}
                placeholderTextColor={theme.text}
              />
              {validation && (
                <Text style={styles.errorMessage}>
                  Please enter your todo item
                </Text>
              )}
              <ButtonComponent
                title="Update"
                onPress={() => {
                  if (editTodoItem.length) {
                    setValidation(false);
                    setInProgress(true);
                    updateTodoItem({...updateTodo, title: editTodoItem})
                      .then(() => {
                        setPageNumber(0);
                        getTodoItems(0, pageSize)
                          .then(items => {
                            setTodoItems(items);
                            setInProgress(false);
                            setModalVisible(false);
                            showToast('success', 'Todo update successfull', '');
                          })
                          .catch(error => {
                            setModalVisible(false);
                            showToast('error', 'Something Went Wrong', '');
                            setInProgress(false);
                            console.log(error);
                          });
                      })
                      .catch(error => {
                        setInProgress(false);
                        showToast('error', 'Try Again', 'Random id error');
                        console.log(error);
                      });
                    setNewTodoItem('');
                  } else {
                    setValidation(true);
                  }
                }}
                disabled={inProgress || reload}
              />
            </View>
          </View>
        </Modal>
      </View>

      <View style={{position: 'absolute', left: '50%', top: '40%'}}>
        <ActivityIndicator
          size={'large'}
          animating={inProgress}
          color={theme.buttonText}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  inputTitle: {
    borderRadius: 6,
    borderWidth: 1,
    margin: 10,
    padding: 7,
  },

  highlight: {
    fontWeight: '700',
  },
  todoItem: {
    fontSize: 18,
    fontWeight: '400',
    borderBottomWidth: 1,
    padding: 8,
    borderBottomColor: 'gray',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  errorMessage: {
    color: 'red',
    margin: 5,
  },
});

export default Todo;
