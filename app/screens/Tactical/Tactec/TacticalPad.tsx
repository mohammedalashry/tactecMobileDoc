import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
} from 'react-native';
import SoccerField from '@assets/images/tactec/SoccerField.png';
import ViewShot, {captureRef} from 'react-native-view-shot';
import FrameCarousel from '@components/TacticalPadComponents/FrameCarousel';
import DrawingTools from '@components/TacticalPadComponents/DrawingTools';
import {color} from 'theme/color';
import {RootState} from 'redux/store';
import {useSelector} from 'react-redux';
import {Players} from '@components/TacticalPadComponents/Players';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Tools from '@components/TacticalPadComponents/Tools';
import {LeftTeam} from '@components/TacticalPadComponents/LeftTeam';
import {FormationLeftSide} from '@components/TacticalPadComponents/FormationsLeftSide';
import ToolBar from '@components/TacticalPadComponents/ToolBar';
import FieldSection from '@components/TacticalPadComponents/FieldSection';
import {RightTeam} from '@components/TacticalPadComponents/RightTeam';
import {FormationRightSide} from '@components/TacticalPadComponents/FormationsRightSide';
import AlmeriaImg from '@assets/images/Screenshot1.png';
import SoccarImg from '@assets/images/tactec/Group1150.png';
import PlayerComponent from '@components/TacticalPadComponents/PlayerComponent';
import ShapeComponent from '@components/TacticalPadComponents/ShapeComponent';
import * as Functions from '@components/TacticalPadComponents/functions';
import {TacticalTools} from 'data/data';
import {Fields, FieldsDown, FieldsUp} from 'data/data';
import {CustomAlert} from '@components/TacticalPadComponents/CustomAlert';
import I18n from 'i18n-js';
import CanvasDrawing, {
  DrawingPath,
} from 'components/TacticalPadComponents/CanvasDrawing';
import {blobToB64} from 'utils/images/blobToB64';
/*-----------------------------------*/

///////////////////////////////////////////
const TacticalPad = ({navigation, route}) => {
  const eventImgs = route.params ? route.params.eventImgs : null;
  const setEventImages = route.params ? route.params.setEventImgs : null;
  const almeriaId = process.env.TEAM_ID;
  const [frames, setFrames] = useState<any[]>([]);
  const animatedPlaygroundRef = useRef(null);
  const fieldRef = useRef<ViewShot>(null);
  const [isDeleteFrame, setIsDeleteFrame] = useState(false);
  const homeTeam: any = useSelector(
    (state: RootState) => state.matches.homeTeam,
  );
  const awayTeam: any = useSelector((state: RootState) => state.matches.team);
  const [showFieldType, setShowFieldType] = useState<'normal' | 'up' | 'down'>(
    'normal',
  );
  const [isShowField, setIsShowField] = useState(false);
  const [_, setPostProject] = useState(false);

  const backgroundImg = useSelector(
    (state: RootState) => state.playground.backgroundImg,
  );
  // const setMatchImages = route.params.setMatchImages;
  //const matchImages = route.params.matchImages;
  const [postProjectAlert, setPostProjectAlert] = useState(false);
  const [exitAlert, setExitAlert] = useState(false);
  const [clearalert, setClearAlert] = useState(false);
  const [errorText1, setErrorText1] = useState('');
  const [errorText2, setErrorText2] = useState('');
  const [isClearDrawing, setIsClearDrawing] = useState(false);
  const ClearAll = () => {
    setClearAlert(false);
    setPostProjectAlert(false);
    setExitAlert(false);
    setIsClearDrawing(false);
    setErrorText1('');
    setErrorText2('');
  };
  const Cancel = () => {
    setClearAlert(false);
    setPostProjectAlert(false);
    setIsClearDrawing(false);
    setExitAlert(false);
    setErrorText1('');
    setErrorText2('');
  };

  // Left Section
  const [isOpenTeamsHome, setIsOpenTeamsHome] = useState(false);
  const [isOpenFormationsHome, setIsOpenFormationsHome] = useState(false);
  const [isOpenToolBar, setIsOpenToolBar] = useState(true);

  const handleOpenTeamsHome = () => {
    setIsOpenTeamsHome(!isOpenTeamsHome);
    setIsOpenFormationsHome(false);
    !isOpenFormationsHome && isOpenTeamsHome
      ? setIsOpenToolBar(true)
      : setIsOpenToolBar(false);
  };
  const handleOpenFormationsHome = () => {
    setIsOpenFormationsHome(!isOpenFormationsHome);
    setIsOpenTeamsHome(false);
    setIsOpenToolBar(!isOpenToolBar);
    isOpenFormationsHome && !isOpenTeamsHome
      ? setIsOpenToolBar(true)
      : setIsOpenToolBar(false);
  };
  // Right Section
  const [isShowDrawTools, setIsShowDrawTools] = useState(true);
  const [isShowPlayers, setIsShowPlayers] = useState(false);
  const [isOpenTeamsAway, setIsOpenTeamsAway] = useState(false);
  const [isOpenFormationsAway, setIsOpenFormationsAway] = useState(false);
  const [isShowTacticalTools, setIsShowTacticalTools] = useState(false);

  const handleReturnMainShow = currentShow => {
    switch (currentShow) {
      case 'players':
        setIsShowPlayers(true);
        setIsShowDrawTools(false);
        setIsShowTacticalTools(false);
        setIsOpenTeamsAway(false);
        setIsOpenFormationsAway(false);
        setSelectedMode('none');
        break;
      case 'draw':
        setIsShowPlayers(false);
        setIsShowDrawTools(true);
        setIsShowTacticalTools(false);
        setIsOpenTeamsAway(false);
        setIsOpenFormationsAway(false);
        break;
      case 'tools':
        setIsShowPlayers(false);
        setIsShowDrawTools(false);
        setIsShowTacticalTools(true);
        setIsOpenTeamsAway(false);
        setIsOpenFormationsAway(false);
        setSelectedMode('none');

        break;
      case 'teams':
        setIsShowPlayers(false);
        setIsShowDrawTools(false);
        setIsShowTacticalTools(false);
        setIsOpenTeamsAway(true);
        setIsOpenFormationsAway(false);
        setSelectedMode('none');

        break;
      case 'formations':
        setIsShowPlayers(false);
        setIsShowDrawTools(false);
        setIsShowTacticalTools(false);
        setIsOpenTeamsAway(false);
        setIsOpenFormationsAway(true);
        setSelectedMode('none');

        break;
      default:
        break;
    }
  };

  const handlePublishProject = () => {
    setPostProjectAlert(true);
    setErrorText1('Are you sure you want to post project?');
  };
  const handlePublish = async () => {
    setPostProjectAlert(false);
    setErrorText1('');
    setErrorText2('');
    frames.map(async (frame, index) => {
      const frame64: any = await blobToB64(frame);
      const data = new FormData();
      data.append('file', frame64);
      const url = await fetch(
        `${process.env.API_URL}/v1/uploads/upload-image`,
        {
          method: 'post',
          body: data,
        },
      )
        .then(res => res.json())
        .then(data => {
          if (data.url) {
            return data.url;
          }
        })
        .catch(err => console.log('91-', err));
      setEventImages(
        eventImgs
          ? [...eventImgs, {url: url, desc: ''}]
          : [{uri: url, desc: ''}],
      );
    });
    navigation.navigate('TactecTraningScreen', {eventImgs});
    setFrames([]);
    setPostProject(false);
    setIsShowField(false);
    setIsShowTacticalTools(false);
    setIsShowPlayers(false);
  };
  const handleAddFrame = async () => {
    if (fieldRef.current && !isShowField) {
      try {
        const uri = await captureRef(fieldRef, {
          format: 'png',
          quality: 0.5,
        });
        setFrames([uri, ...frames]);
      } catch (error) {
        console.error('Failed to capture snapshot:', error);
      }
    }
  };
  const onDeleteFrame = () => {
    setIsDeleteFrame(!isDeleteFrame);
  };
  const handleDeleteFrame = index => {
    const newFrames = frames.filter((_, i) => i !== index);
    setFrames(newFrames);
  };
  const onFieldButtonPress = () => {
    setIsShowField(!isShowField);
    setIsDeleteFrame(false);
    setIsShowTacticalTools(false);
    setIsShowPlayers(false);
  };
  const onPlayersButtonPress = () => {
    if (isShowPlayers) {
      handleReturnMainShow('draw');
    } else {
      handleReturnMainShow('players');
      setIsShowField(false);
    }
  };
  const onToolsButtonPress = () => {
    if (isShowTacticalTools) {
      handleReturnMainShow('draw');
    } else {
      handleReturnMainShow('tools');
      setIsShowField(false);
    }
  };
  const onExitPress = () => {
    setExitAlert(true);
    setErrorText1('Are you sure you want to exit?');
    setErrorText2('All unsaved data will be lost');
  };
  const handleExit = () => {
    setExitAlert(false);
    setErrorText1('');
    setErrorText2('');
    navigation.goBack();
    setFrames([]);
  };

  const fieldType = () => {
    switch (backgroundImg?.imageCategory) {
      case 'fileds':
        return Fields[backgroundImg?.imageId];
      case 'filedsUp':
        return FieldsUp[backgroundImg?.imageId];
      case 'filedsDown':
        return FieldsDown[backgroundImg?.imageId];
      default:
        return;
    }
  };
  /////////////////////////// TACTICAL PAD COMPONENTS and WORK /////////////////////////

  /*_________________ Players Component and Functions _________________*/
  const [playersOnField, setPlayersOnField] = useState<{}[]>([]);
  const [awayPlayersOnField, setAwayPlayersOnField] = useState<{}[]>([]);
  const selectedPlayers = useSelector(
    (state: RootState) => state.tacticalPlayers.selectedPlayers,
  );
  const [playgroundDimensions, setPlaygroundDimensions] = useState({
    width: 0,
    height: 0,
  });
  const onPlaygroundLayout = event => {
    const {width, height} = event.nativeEvent.layout;
    setPlaygroundDimensions({width, height});
  };
  const almeriaFormation = useSelector(
    (state: RootState) => state.matches.almeriaFormation,
  );
  const opposingFormation = useSelector(
    (state: RootState) => state.matches.opposingFormation,
  );

  const getSelectedPlayers = examplePlayers => {
    const newPlayers = examplePlayers.map(player => {
      const selectedPlayer = selectedPlayers.find(
        selectedPlayer => selectedPlayer.position === player.position,
      );
      if (selectedPlayer) {
        return {
          ...player,
          shirtNumber: selectedPlayer.shirtNumber,
        };
      }
      return player;
    });
    return newPlayers;
  };

  useEffect(() => {
    if (almeriaFormation.text === '-' && opposingFormation.text === '-') return;
    if (homeTeam && playgroundDimensions.width > 0) {
      let homePlayers = Functions.getPlayersOnGround(
        homeTeam._id === almeriaId
          ? almeriaFormation.text
          : opposingFormation.text,
        'home',
        playgroundDimensions.width,
        playgroundDimensions.height,
        20,
        homeTeam._id === almeriaId ? true : false,
      );
      if (homeTeam._id === almeriaId) {
        homePlayers = getSelectedPlayers(homePlayers);
      }
      setPlayersOnField(homePlayers);
    }
  }, [almeriaFormation, opposingFormation, selectedPlayers]);
  useEffect(() => {
    if (almeriaFormation.text === '-' && opposingFormation.text === '-') return;
    if (awayTeam && playgroundDimensions.width > 0) {
      let awayPlayers = Functions.getPlayersOnGround(
        awayTeam._id === almeriaId
          ? almeriaFormation.text
          : opposingFormation.text,
        'away',
        playgroundDimensions.width,
        playgroundDimensions.height,
        20,
        awayTeam._id === almeriaId ? true : false,
      );
      if (awayTeam._id === almeriaId) {
        awayPlayers = getSelectedPlayers(awayPlayers);
      }
      setAwayPlayersOnField(awayPlayers);
    }
  }, [almeriaFormation, opposingFormation, selectedPlayers]);

  const MemoizedPlayerComponent = React.memo(
    PlayerComponent,
    (prevProps, nextProps) => {
      return (
        prevProps.player.x === nextProps.player.x &&
        prevProps.player.y === nextProps.player.y &&
        prevProps.player.team === nextProps.player.team
      );
    },
  );

  /*______________Handle tools and shapes components and functions ___________*/

  const [shapes, setShapes] = useState<any[]>([]);
  const [isEraseMode, setIsEraseMode] = useState(false);
  const [shapeCounter, setShapeCounter] = useState(0);

  const handleAddShape = shapeId => {
    const newShape = {
      id: shapeId,
      x: 50,
      y: 50,
      scaleX: 1,
      scaleY: 1,
      rotation: 0,
      counterId: shapeCounter,
    };
    setShapes([...shapes, newShape]);
    setShapeCounter(prev => prev + 1);
  };

  const deleteShape = index => {
    const newShapes = shapes.filter((shape, i) => shape.counterId !== index);
    setShapes(newShapes);
  };

  const toggleEraseMode = () => {
    setIsEraseMode(!isEraseMode);
  };

  /*______________________Handle Drawing Functionality ____________________*/
  const [strokeWidth, setStrokeWidth] = useState('3');
  const [selectedMode, setSelectedMode] = useState<
    'draw' | 'erase' | 'none' | 'move'
  >('none');
  const [selectedTool, setSelectedTool] = useState<
    'line' | 'free' | 'curve' | 'shape'
  >('line');
  const [selectedStyle, setSelectedStyle] = useState<
    'arrow' | 'ticon' | 'zigzag' | 'arrowDouble' | 'dash' | 'normal'
  >('arrow');
  const [selectedColor, setSelectedColor] = useState('#FFFFFF');
  const [selectedShape, setSelectedShape] = useState<
    'circle' | 'rect' | 'triangle'
  >('circle');
  const [paths, setPaths] = useState<DrawingPath[]>([]);

  const handleClearAll = () => {
    setIsClearDrawing(true);
    setErrorText1('Are you sure you want to clear all?');
  };
  const clearAllDrawing = () => {
    setPaths([]);
    setIsClearDrawing(false);
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.container}>
        {/* Left Section */}
        <View style={styles.leftSection}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '100%',
              alignItems: 'center',
            }}>
            <TouchableOpacity onPress={() => handleOpenTeamsHome()}>
              <Image
                source={homeTeam?.icon ? {uri: homeTeam?.icon} : AlmeriaImg}
                style={{width: 50, height: 50, resizeMode: 'contain'}}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleOpenFormationsHome}>
              <Image source={SoccarImg} />
            </TouchableOpacity>
          </View>
          {isOpenToolBar && (
            <ToolBar
              onDeleteFrame={onDeleteFrame}
              onExit={onExitPress}
              onFieldButton={onFieldButtonPress}
              onPlayersButton={onPlayersButtonPress}
              onPublish={handlePublishProject}
              onSaveFrame={handleAddFrame}
              onToolsButton={onToolsButtonPress}
              isDeleteFrame={isDeleteFrame}
              isShowField={isShowField}
              isShowDrawTools={isShowDrawTools}
              isShowPlayers={isShowPlayers}
              isShowTacticalTools={isShowTacticalTools}
            />
          )}
          {isOpenTeamsHome && (
            <LeftTeam
              setAlerText1={setErrorText1}
              setAlerText2={setErrorText2}
              almeriaId={almeriaId}
              setopenTeams={handleOpenTeamsHome}
              setAlert={setClearAlert}
            />
          )}
          {isOpenFormationsHome && (
            <FormationLeftSide
              setopenFormations={handleOpenFormationsHome}
              setAlerText1={setErrorText1}
              setAlerText2={setErrorText2}
              almeriaId={almeriaId}
              setAlert={setClearAlert}
            />
          )}
        </View>
        {/* Middle Section */}
        <View style={styles.middleSection}>
          {isShowField && (
            <FieldSection
              setIsShowField={setIsShowField}
              setPostProject={setPostProject}
              setShowFieldType={setShowFieldType}
              showFieldType={showFieldType}
            />
          )}
          {!isShowField && (
            <>
              <View style={{flex: 1, height: '80%'}}>
                <ViewShot
                  style={{flex: 1}}
                  ref={fieldRef}
                  options={{format: 'jpg', quality: 0.8, result: 'data-uri'}}>
                  <ImageBackground
                    ref={animatedPlaygroundRef}
                    resizeMode="stretch"
                    style={[styles.bgImage, {flex: 1}]}
                    imageStyle={[{width: '100%', height: '100%'}]}
                    source={fieldType() ? fieldType()?.image : SoccerField}
                    onLayout={onPlaygroundLayout}>
                    <CanvasDrawing
                      paths={paths}
                      setPaths={setPaths}
                      selectedMode={selectedMode}
                      selectedTool={selectedTool}
                      selectedStyle={selectedStyle}
                      selectedColor={selectedColor}
                      strokeWidth={strokeWidth}
                      selectedShape={selectedShape}
                    />
                    {playersOnField.map((player: any) => (
                      <MemoizedPlayerComponent
                        key={player.id}
                        player={player}
                      />
                    ))}
                    {awayPlayersOnField.map((player: any) => (
                      <MemoizedPlayerComponent
                        key={player.id}
                        player={player}
                      />
                    ))}
                    {shapes.map((shape, index) => {
                      const toolImage = TacticalTools.find(
                        tool => tool.id === shape.id,
                      )?.image;
                      return toolImage ? (
                        <ShapeComponent
                          key={shape.counterId}
                          shape={shape}
                          index={shape.counterId}
                          toolImage={toolImage}
                          isEraseMode={isEraseMode}
                          deleteShape={deleteShape}
                          selectedMode={selectedMode}
                        />
                      ) : null;
                    })}
                  </ImageBackground>
                </ViewShot>
              </View>
              <FrameCarousel
                frames={frames}
                onDeleteFrame={handleDeleteFrame}
                isDeleteFrame={isDeleteFrame}
              />
            </>
          )}
        </View>
        {/* Right Section */}
        <View style={styles.rightSection}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '100%',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={() =>
                isOpenFormationsAway
                  ? handleReturnMainShow('draw')
                  : handleReturnMainShow('formations')
              }>
              <Image source={SoccarImg} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                isOpenTeamsAway
                  ? handleReturnMainShow('draw')
                  : handleReturnMainShow('teams')
              }>
              <Image
                source={awayTeam?.icon ? {uri: awayTeam?.icon} : AlmeriaImg}
                style={{width: 50, height: 50, resizeMode: 'contain'}}
              />
            </TouchableOpacity>
          </View>
          {isOpenFormationsAway && (
            <FormationRightSide
              setShowDefault={handleReturnMainShow}
              setAlerText1={setErrorText1}
              setAlerText2={setErrorText2}
              almeriaId={almeriaId}
              setAlert={setClearAlert}
            />
          )}
          {isOpenTeamsAway && (
            <RightTeam
              setShowDefault={handleReturnMainShow}
              setAlerText1={setErrorText1}
              setAlerText2={setErrorText2}
              almeriaId={almeriaId}
              setAlert={setClearAlert}
            />
          )}
          {/* <View style={styles.toolSection}> */}
          {isShowDrawTools && (
            <DrawingTools
              setSelectedMode={setSelectedMode}
              setSelectedTool={setSelectedTool}
              setSelectedStyle={setSelectedStyle}
              setSelectedColor={setSelectedColor}
              setStrokeWidth={setStrokeWidth}
              handleClear={handleClearAll}
              selectedTool={selectedTool}
              selectedStyle={selectedStyle}
              strokeWidth={strokeWidth}
              selectedColor={selectedColor}
              selectedMode={selectedMode}
              selectedShape={selectedShape}
              setSelectedShape={setSelectedShape}
            />
          )}
          {isShowPlayers && (
            <Players handleSectionShow={handleReturnMainShow} />
          )}
          {isShowTacticalTools && (
            <Tools
              onAddShape={handleAddShape}
              toggleEraseMode={toggleEraseMode}
              isEraseMode={isEraseMode}
            />
          )}
          {/* </View> */}
        </View>
        <CustomAlert
          isShow={clearalert}
          text={errorText1}
          text2={errorText2}
          confirm={ClearAll}
          Confirm={I18n.t('TectacBoard.Clear')}
          Cancel={I18n.t('TectacBoard.Cancel')}
          cancel={Cancel}
        />
        <CustomAlert
          isShow={isClearDrawing}
          text={errorText1}
          text2={errorText2}
          confirm={clearAllDrawing}
          Confirm={I18n.t('TectacBoard.Clear')}
          Cancel={I18n.t('TectacBoard.Cancel')}
          cancel={Cancel}
        />
        <CustomAlert
          isShow={postProjectAlert}
          text={errorText1}
          text2={errorText2}
          confirm={handlePublish}
          Confirm={'Post Project'}
          Cancel={I18n.t('TectacBoard.Cancel')}
          cancel={Cancel}
        />
        <CustomAlert
          isShow={exitAlert}
          text={errorText1}
          text2={errorText2}
          confirm={handleExit}
          Confirm={'Exit'}
          Cancel={I18n.t('TectacBoard.Cancel')}
          cancel={Cancel}
        />
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.background,
    flexDirection: 'row',
  },
  leftSection: {
    width: '20%',
    padding: 10,
    borderRightWidth: 1,
    borderColor: '#ccc',
    flexDirection: 'column',
  },
  middleSection: {
    width: '58%',
    padding: 10,
    flexDirection: 'column',
  },
  rightSection: {
    width: '22%',
    padding: 10,
    borderLeftWidth: 1,
    borderColor: '#ccc',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  toolSection: {
    flex: 1,
    marginTop: 20,
    flexDirection: 'column',
    flexWrap: 'wrap',
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },
  bgImage: {
    width: '100%',
    height: '100%',
    zIndex: -1,
  },
});
export default TacticalPad;
