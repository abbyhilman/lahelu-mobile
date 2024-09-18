import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, useWindowDimensions, FlatList, Modal, TextInput, Button, Alert, ActivityIndicator, InteractionManager } from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus, AVPlaybackStatusError } from 'expo-av';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

type DummyVideoProps = {
    post: {
        id: string;
        video: string;
        caption: string;
        tags: string[];
        comments: { id: string; text: string }[];
    };
    activePostId: string;
};

const DummyVideo = ({ post, activePostId }: DummyVideoProps) => {
    const video = useRef<Video>(null);
    const [status, setStatus] = useState<AVPlaybackStatus | AVPlaybackStatusError>();
    const [modalVisible, setModalVisible] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [loading, setLoading] = useState(true);

    const isPlaying = status?.isLoaded && status.isPlaying;
    const { height } = useWindowDimensions();

    useEffect(() => {
        if (!video.current) return;

        if (activePostId === post.id) {
            video.current.playAsync();
        } else {
            video.current.pauseAsync();
        }
    }, [activePostId, status]);

    const handleCommentSubmit = () => {
        if (commentText.trim()) {
            try {
                Alert.alert('Comment Submitted', `Comment: ${commentText}`);
                setCommentText('');
                setModalVisible(false);
            } catch (error) {
                Alert.alert('Submission Error', 'There was an error submitting your comment.');
            }
        } else {
            Alert.alert('Empty Comment', 'Please enter a comment before submitting.');
        }
    };

    const handleLoadStart = () => {
        setLoading(true);
    };

    const handleLoad = () => {
        setLoading(false);
        if (video.current) {
            video.current.playAsync(); // Auto-play after loading
        }
    };

    const handlePlaybackStatusUpdate = (status: AVPlaybackStatus | AVPlaybackStatusError) => {
        setStatus(status);
        if (status && 'didJustFinish' in status && status.didJustFinish) {
            video.current?.replayAsync(); // Replay video when it finishes
        }
    };


    return (
        <View style={[styles.container, { height }]}>
            {loading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color="#ffffff" />
                </View>
            )}

            <Video
                ref={video}
                style={[StyleSheet.absoluteFill, styles.video]}
                source={{ uri: post.video }}
                resizeMode={ResizeMode.COVER}
                onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
                shouldPlay={false}
                onLoadStart={handleLoadStart}
                onLoad={handleLoad}
            />



            <Pressable style={styles.content}>
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.8)']}
                    style={[StyleSheet.absoluteFillObject, styles.overlay]}
                />
                <SafeAreaView style={{ flex: 1 }}>
                    <View style={styles.footer}>
                        <View style={styles.leftColumn}>
                            <Text style={styles.caption}>{post.caption}</Text>
                            <View style={styles.tagsContainer}>
                                {post.tags.map((tag, index) => (
                                    <Text key={index} style={styles.tag}>#{tag}</Text>
                                ))}
                            </View>
                            <View style={styles.commentsContainer}>
                                <FlatList
                                    data={post.comments}
                                    renderItem={({ item }) => (
                                        <Text style={styles.comment}>{item.text}</Text>
                                    )}
                                    keyExtractor={item => item.id}
                                />
                            </View>
                        </View>

                        <View style={styles.rightColumn}>
                            <Pressable style={styles.button}>
                                <Ionicons name="cash-outline" size={35} color="white" />
                                <Text style={styles.buttonText}>Sawer</Text>
                            </Pressable>
                            <Pressable style={styles.button} onPress={() => setModalVisible(true)}>
                                <Ionicons name="chatbubble-outline" size={35} color="white" />
                                <Text style={styles.buttonText}>Comment</Text>
                            </Pressable>
                        </View>
                    </View>
                </SafeAreaView>
            </Pressable>

            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Write your comment..."
                            value={commentText}
                            onChangeText={setCommentText}
                            multiline
                        />
                        <Button title="Submit" onPress={handleCommentSubmit} />
                        <Button title="Cancel" onPress={() => setModalVisible(false)} color="red" />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {},
    video: {},
    content: {
        flex: 1,
        padding: 10,
    },
    overlay: {
        top: '50%',
    },
    footer: {
        marginTop: 'auto',
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    leftColumn: {
        flex: 1,
    },
    caption: {
        color: 'white',
        fontFamily: 'Inter',
        fontSize: 18,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginVertical: 5,
    },
    tag: {
        color: 'gray',
        fontSize: 14,
        marginRight: 5,
    },
    commentsContainer: {
        marginTop: 10,
    },
    comment: {
        color: 'white',
        fontSize: 14,
        marginBottom: 5,
    },
    rightColumn: {
        gap: 10,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonText: {
        color: 'white',
        marginLeft: 5,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
    },
    textInput: {
        height: 100,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        textAlignVertical: 'top',
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
});

export default DummyVideo;