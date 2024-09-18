import React from 'react';
import { View, StyleSheet, FlatList, Modal, Image, Text, Pressable, TouchableWithoutFeedback } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import VideoPost from '@/components/DummyVideo';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import Animated, { SlideInLeft, SlideOutLeft, useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
// import SvgUri from 'react-native-svg-uri';

const dummyPosts = [
    {
        id: '2',
        video: 'https://videos.pexels.com/video-files/855029/855029-hd_1920_1080_30fps.mp4',
        caption: 'Caption of the post',
        tags: ['hello', 'greeting'],
        comments: [
            { id: 'c1', text: 'Hello!' },
        ],
    },
    {
        id: '1',
        video: 'https://videos.pexels.com/video-files/6853337/6853337-uhd_1440_2732_25fps.mp4',
        caption: 'Hey there',
        tags: ['fun', 'dance'],
        comments: [
            { id: 'c1', text: 'Great video!' },
            { id: 'c2', text: 'Love this!' },
        ],
    },
    {
        id: '3',
        video: 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/vertical-videos/3.mp4',
        caption: 'Hola',
        tags: ['greetings'],
        comments: [],
    },
    {
        id: '4',
        video: 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/vertical-videos/4.mp4',
        caption: 'Piano practice',
        tags: ['music'],
        comments: [],
    },
    {
        id: '5',
        video: 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/vertical-videos/5.mp4',
        caption: 'Hello World!',
        tags: ['intro'],
        comments: [],
    },
];

const HomeScreen = () => {
    const [activePostId, setActivePostId] = useState(dummyPosts[0].id);
    const [posts, setPosts] = useState(dummyPosts);
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);

    const buttonPosition = useSharedValue(90); // Initially at 90 when sidebar is visible

    const animatedButtonStyle = useAnimatedStyle(() => {
        return {
            left: withTiming(buttonPosition.value, { duration: 500 }), // Smooth transition
        };
    });

    const toggleSidebar = () => {
        setSidebarVisible(!sidebarVisible);
        buttonPosition.value = sidebarVisible ? 10 : 90; // Move button left when sidebar is hidden, right when shown
    };

    const viewabilityConfigCallbackPairs = useRef([
        {
            viewabilityConfig: { itemVisiblePercentThreshold: 50 },
            onViewableItemsChanged: ({ viewableItems }) => {
                if (viewableItems.length > 0 && viewableItems[0].isViewable) {
                    setActivePostId(viewableItems[0].item.id);
                }
            },
        },
    ]);

    const onEndReached = () => {
        setPosts((currentPosts) => [...currentPosts, ...dummyPosts]);
    };

    const handleLogin = () => {
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
    };

    const getItemLayout = (data, index) => ({
        length: 300, // Height of each item (adjust based on your item height)
        offset: 300 * index,
        index,
    });

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            {sidebarVisible && (
                <Animated.View
                    style={styles.sidebar}
                    entering={SlideInLeft.duration(500)}
                    exiting={SlideOutLeft.duration(500)}
                >
                    <Pressable style={styles.sidebarButton}>
                        <Ionicons name="home" size={30} color="white" />
                        <Text style={styles.sidebarText}>Home</Text>
                    </Pressable>
                    <Pressable style={styles.sidebarButton}>
                        <Ionicons name="time-outline" size={30} color="white" />
                        <Text style={styles.sidebarText}>Fresh</Text>
                    </Pressable>
                    <Pressable style={styles.sidebarButton}>
                        <Ionicons name="trending-up" size={30} color="white" />
                        <Text style={styles.sidebarText}>Trending</Text>
                    </Pressable>
                    <Pressable style={styles.sidebarButton}>
                        <Ionicons name="list" size={30} color="white" />
                        <Text style={styles.sidebarText}>Topik</Text>
                    </Pressable>
                    <Pressable style={styles.loginButton} onPress={handleLogin}>
                        <Ionicons name="log-in" size={30} color="white" />
                        <Text style={styles.loginText}>Login</Text>
                    </Pressable>
                </Animated.View>
            )}

            <FlatList
                data={posts}
                renderItem={({ item }) => <VideoPost post={item} activePostId={activePostId} />}
                keyExtractor={(item, index) => `${item.id}-${index}`}
                initialNumToRender={5}  // Render only 5 items initially
                windowSize={10}         // Number of items kept in memory
                pagingEnabled
                viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
                showsVerticalScrollIndicator={false}
                onEndReached={onEndReached}
                onEndReachedThreshold={3}
                style={styles.feedArea}
                removeClippedSubviews={true}
                getItemLayout={getItemLayout}
            />

            <Animated.View style={[styles.toggleButton, animatedButtonStyle]}>
                <Pressable onPress={toggleSidebar}>
                    <Ionicons name={sidebarVisible ? 'close' : 'menu'} size={30} color="white" />
                </Pressable>
            </Animated.View>

            <Modal
                transparent={true}
                visible={modalVisible}
                animationType="slide"
                onRequestClose={handleCloseModal}
            >
                <TouchableWithoutFeedback onPress={handleCloseModal}>
                    <View style={styles.modalContainer}>
                        <TouchableWithoutFeedback>
                            <View style={styles.modalContent}>


                                {/* <SvgFromUrl url={'https://lahelu.com/media/icons/icon-only.svg'} width={100} height={100} /> */}

                                <Text style={styles.modalTitle}>Selamat datang!</Text>
                                <Text style={styles.modalDescription}>
                                    Buat meme, beri vote, dan berkomentar setelah login dengan Google.
                                </Text>
                                <Pressable style={styles.googleLoginButton} onPress={() => { /* Handle Google login */ }}>
                                    <Image
                                        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/281/281764.png' }} // Google icon URL
                                        style={styles.googleIcon}
                                    />
                                    <Text style={styles.googleLoginText}>Login with Google</Text>
                                </Pressable>
                                <Pressable onPress={handleCloseModal} style={styles.closeButton}>
                                    <Ionicons name="close" size={30} color="white" />
                                </Pressable>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        flexDirection: 'row',
    },
    sidebar: {
        width: 80,
        backgroundColor: '#1e1e1e',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 50,
    },
    sidebarButton: {
        alignItems: 'center',
        marginBottom: 25,
    },
    sidebarText: {
        color: 'white',
        fontSize: 12,
        marginTop: 5,
    },
    feedArea: {
        flex: 1,
    },
    toggleButton: {
        position: 'absolute',
        top: 40,
        padding: 10,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 30,
    },
    loginButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#1e1e1e',
        padding: 10,
        borderRadius: 20,
    },
    loginText: {
        color: 'white',
        fontSize: 16,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        width: '80%',
        alignItems: 'center',
    },
    modalText: {
        marginBottom: 20,
        fontSize: 16,
        textAlign: 'center',
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalDescription: {
        marginBottom: 20,
        fontSize: 16,
        textAlign: 'center',
    },
    googleLoginButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#6babf5',
        padding: 10,
        borderRadius: 5,
    },
    googleIcon: {
        width: 24,
        height: 24,
        marginRight: 10,
    },
    googleLoginText: {
        color: 'white',
        fontSize: 16,
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
});
export default HomeScreen;
