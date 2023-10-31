import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js';

const modelUrl = new URL('../assets/Gladiator-pose.glb', import.meta.url);
const modelUrl2 = new URL('../assets/desert_dragon.glb', import.meta.url);

const renderer = new THREE.WebGLRenderer({antialias: true});





renderer.setSize(window.innerWidth, window.innerHeight);

renderer.setClearColor(0xCCCCCC); //BACKGROUND

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();


const camera = new THREE.PerspectiveCamera(
    20,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

//ORBITCONTROL
const orbit = new OrbitControls(camera, renderer.domElement);



//POSIÇÃO DA CAMERA
camera.position.set(10, 6, 10);
orbit.update();



//ILUMINAÇÃO 
const ambientLight = new THREE.AmbientLight(0x606060, 3);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 3);
scene.add(directionalLight);
directionalLight.position.set(1, 0.75, 0.5);

const assetLoader = new GLTFLoader();


let stag, Drag;
let clips;

// MODELO DRAGÃO
assetLoader.load(modelUrl2.href, function(gltf) {
    const model = gltf.scene;
    model.scale.set(10, 10, 10);
    model.position.set( 0, 0, -7 );
    //model.rotation.y = 3

    // scene.add(model);
    
    Drag = model;
    clips = gltf.animations;
    
    const mixer = new THREE.AnimationMixer(Drag);
    
    const clip = THREE.AnimationClip.findByName(clips, 'Walk');
    const action = mixer.clipAction(clip);
    action.play();
    mixers.push(mixer);

}, undefined, function(error) {
    console.error(error);
});



//GLADIADOR COM MOVIMENTO
// let mixer;
assetLoader.load(modelUrl.href, function(gltf) {
    const model = gltf.scene;
    model.scale.set(0.3, 0.3, 0.3);
    model.rotation.y = 3
    // scene.add(model);
    stag = model;
    clips = gltf.animations;
}, undefined, function(error) {
    console.error(error);
});




const planeMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshBasicMaterial({
        side: THREE.DoubleSide,
        visible: false
    })
);
planeMesh.rotateX(-Math.PI / 2);
scene.add(planeMesh);



const grid = new THREE.GridHelper(20, 20);
scene.add(grid);



const highlightMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.MeshBasicMaterial({
        side: THREE.DoubleSide,
        transparent: true
    })
);
highlightMesh.rotateX(-Math.PI / 2);
highlightMesh.position.set(0.5, 0, 0.5);
scene.add(highlightMesh);

const mousePosition = new THREE.Vector2();
const raycaster = new THREE.Raycaster();


const objects = [];
const mixers = [];
let intersects = [];



/*const DragClone = SkeletonUtils.clone(Drag);
            stagClone.position.copy(highlightMesh.position);
            scene.add(DragClone);
            //objects.push(stagClone);
            
            highlightMesh.material.color.setHex(0xFF0000);

            const mixer = new THREE.AnimationMixer(DragClone);
            const clip = THREE.AnimationClip.findByName(clips, 'Walk');
            const action = mixer.clipAction(clip);
            action.play();
            mixers.push(mixer);*/


            // let currentModel = 'gladiator'; // Começa com o modelo 'gladiator'

            // // Evento de clique no botão
            // const changeModelButton = document.getElementById('changeModelButton');
            // changeModelButton.addEventListener('click', () => {
            //     // Remove o modelo atual da cena
            //     if (currentModel === 'gladiator') {
            //         scene.remove(stag);
            //     } else if (currentModel === 'dragon') {
            //         scene.remove(Drag);
            //     }
            
            //     // Alterna para o próximo modelo
            //     if (currentModel === 'gladiator') {
            //         currentModel = 'dragon';
            //         scene.add(Drag); // Adiciona o modelo 'dragon' à cena
            //     } else {
            //         currentModel = 'gladiator';
            //         scene.add(stag); // Adiciona o modelo 'gladiator' à cena
            //     }
            // });





    window.addEventListener('mousemove', function(e) {
    mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
    mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mousePosition, camera);
    
    intersects = raycaster.intersectObject(planeMesh);
        
        if(intersects.length > 0) {
            const highlightPos = new THREE.Vector3().copy(intersects[0].point).floor().addScalar(0.5);
            highlightMesh.position.set(highlightPos.x, 0, highlightPos.z);

            const objectExist = objects.find(function(object) {
                return (object.position.x === highlightMesh.position.x)
                && (object.position.z === highlightMesh.position.z)
            });

            if(!objectExist)
                highlightMesh.material.color.setHex(0xFFFFFF);
            else
                highlightMesh.material.color.setHex(0xFF0000);
        }
});





// const sphereMesh = new THREE.Mesh(
//     new THREE.SphereGeometry(0.4, 4, 2),
//     new THREE.MeshBasicMaterial({
//         wireframe: true,
//         color: 0xFFEA00
//     })
// );



// window.addEventListener('mousedown', function(event) {
//     const objectExist = objects.find(function(object) {
//         return (object.position.x === highlightMesh.position.x)
//         && (object.position.z === highlightMesh.position.z)
//     });

    
//     if(!objectExist) {
//         if(intersects.length > 0) {
//             const stagClone = SkeletonUtils.clone(stag);
//             stagClone.position.copy(highlightMesh.position);
//             scene.add(stagClone);
//             objects.push(stagClone);
            
//             highlightMesh.material.color.setHex(0xFF0000);

//             const mixer = new THREE.AnimationMixer(stagClone);
//             const clip = THREE.AnimationClip.findByName(clips, 'Armature|mixamo.com|Layer0.001'/*'Armature|mixamo.com|Layer0.002'*/);
//             const action = mixer.clipAction(clip);
//             action.play();
//             mixers.push(mixer);
//         }
        

        
//         if (shiftKeyPressed) {
//             const mousePosition = new THREE.Vector2();
        
//             mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1;
//             mousePosition.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
//             raycaster.setFromCamera(mousePosition, camera);
        
//             // Verifique a interseção com os objetos
//             const intersects = raycaster.intersectObjects(objects);
        
//             if (intersects.length > 0) {
//               const objectToRemove = intersects[0].object;
        
//               // Verifique se o objeto a ser removido não é o "highlightMesh"
//               if (objectToRemove !== highlightMesh) {
    //                 removeObjectFromScene(objectToRemove);
    //                 removeObjectFromList(objectToRemove);
    //               }
    //             }
    //           } else {
        //             // Adicione um novo objeto à cena ao clicar sem Shift pressionado
        //             addNewObjectToScene();
        //           }
        
        
        //     }
        //     console.log(scene.children.length);
        // });
        
        
        
        let shiftKeyPressed = false;
        
        
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Shift') {
                shiftKeyPressed = true;
            }
        });
        
        document.addEventListener('keyup', (event) => {
            if (event.key === 'Shift') {
                shiftKeyPressed = false;
            }
        });
        
        
        
        
        
        
        
        // window.addEventListener('mousedown', function(event) {
        // const objectExist = objects.find(function(object) {
        //     return (object.position.x === highlightMesh.position.x)
        //     && (object.position.z === highlightMesh.position.z)
        // });
    
        
        // if(!objectExist) {
        //     if(intersects.length > 0) {
        //         const stagClone = SkeletonUtils.clone(stag);
        //         stagClone.position.copy(highlightMesh.position);
        //         scene.add(stagClone);
        //         objects.push(stagClone);
                
        //         highlightMesh.material.color.setHex(0xFF0000);
    
        //         const mixer = new THREE.AnimationMixer(stagClone);
        //         const clip = THREE.AnimationClip.findByName(clips, 'Armature|mixamo.com|Layer0.001'/*'Armature|mixamo.com|Layer0.002'*/);
        //         const action = mixer.clipAction(clip);
        //         action.play();
        //         mixers.push(mixer);
        //     }
            
        // }
        
   

            // // Remove o objeto se o Shift estiver pressionado
            // if (objectExist && shiftKeyPressed) {
            //     intersects.length = 0;
            //         scene.remove(objectExist); // Remove o objeto da cena
            //         objects = objects.filter(function(object) {
            //                 return object !== objectExist;
            //             });
                        
                       
            //         }
                
                //console.log(scene.children.length);
                
                
            // });
        
        
        
        
        
        // TENTANDO APAGAR COM O SHIFT
        

        let selectedModel = null;

        gladiatorButton.addEventListener('click', function() {
            selectedModel = 'gladiator';
        });
        
        dragonButton.addEventListener('click', function() {
            selectedModel = 'dragon';
        });

        window.addEventListener('mousedown', function(event) {
            const mousePosition = new THREE.Vector2();
            mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1;
            mousePosition.y = -(event.clientY / window.innerHeight) * 2 + 1;
            
            raycaster.setFromCamera(mousePosition, camera);
        
            intersects = raycaster.intersectObject(planeMesh);
        
            if (selectedModel && intersects.length > 0) {
                const position = intersects[0].point;
                addModelToScene(selectedModel, position);
                selectedModel = null; // Redefina o modelo selecionado
            }
        });

        function addModelToScene(modelType, position) {
            if (modelType === 'gladiator') {
                const stagClone = SkeletonUtils.clone(stag);
                stagClone.position.copy(position);
                scene.add(stagClone);
                objects.push(stagClone);
        
                const mixer = new THREE.AnimationMixer(stagClone);
                const clip = THREE.AnimationClip.findByName(clips, 'Armature|mixamo.com|Layer0.002');
                const action = mixer.clipAction(clip);
                action.play();
                mixers.push(mixer);


            } else if (modelType === 'dragon') {
                const dragonClone = SkeletonUtils.clone(Drag);
                dragonClone.position.copy(position);
                scene.add(dragonClone);
                objects.push(dragonClone);
        
                // const mixer = new THREE.AnimationMixer(dragonClone);
                // const clip = THREE.AnimationClip.findByName(clips, 'Walk');
                // const action = mixer.clipAction(clip);
                // action.play();
                // mixers.push(mixer);

            }
        }
        













    //     // Obtendo referências para os botões
    //     const gladiatorButton = document.getElementById('gladiatorButton');
    //     const dragonButton = document.getElementById('dragonButton');

        

    // // Adicionando manipuladores de eventos para os botões
    // gladiatorButton.addEventListener('click', function() {
    //     addModelToScene('gladiator'); // Chama a função para adicionar o modelo "gladiator" à cena
    // });

    // dragonButton.addEventListener('click', function() {
    //     addModelToScene('dragon'); // Chama a função para adicionar o modelo "dragon" à cena
    // });

    // // Função para adicionar modelos à cena
    // function addModelToScene(modelType) {
    //     if (modelType === 'gladiator') {
    //         const stagClone = SkeletonUtils.clone(stag);
    //         stagClone.position.copy(highlightMesh.position);
    //         scene.add(stagClone);
    //         objects.push(stagClone);

    //         // Configurar cor, animações, etc., conforme necessário
    //     } else if (modelType === 'dragon') {
    //         const dragonClone = SkeletonUtils.clone(Drag);
    //         dragonClone.position.copy(highlightMesh.position);
    //         scene.add(dragonClone);
    //         objects.push(dragonClone);

    //         // Configurar cor, animações, etc., conforme necessário
    //     }

    //     // Ocultar as opções de modelo após a escolha
    //     document.getElementById('modelOptions').style.display = 'none';
    // }

    // // Evento de clique no plano para mostrar as opções de modelo
    // window.addEventListener('mousedown', function(event) {
    //     const objectExist = objects.find(function(object) {
    //         return (object.position.x === highlightMesh.position.x) &&
    //             (object.position.z === highlightMesh.position.z);
    //     });

    //     if (!objectExist) {
    //         if (intersects.length > 0) {
    //             // Mostrar as opções de modelo na tela
    //             document.getElementById('modelOptions').style.display = 'block';
    //         }
    //     }
    // });

        


        
// window.addEventListener('mousedown', function(event) {
//     const objectExist = objects.find(function(object) {
//         return (object.position.x === highlightMesh.position.x) && (object.position.z === highlightMesh.position.z);
//     });

//     if (shiftKeyPressed) {
//         // Se a tecla Shift estiver pressionada, remova o objeto existente
//         if (objectExist) {
//             scene.remove(objectExist);
//             objects = objects.filter(function(object) {
//                 return object !== objectExist;
//             });
//         }
//     } else {
//         // Se a tecla Shift não estiver pressionada, adicione o modelo
//         if (!objectExist && intersects.length > 0) {
//             const stagClone = SkeletonUtils.clone(stag);
//             stagClone.position.copy(highlightMesh.position);
//             scene.add(stagClone);
//             objects.push(stagClone);

//             highlightMesh.material.color.setHex(0xFF0000);

//             const mixer = new THREE.AnimationMixer(stagClone);
//             const clip = THREE.AnimationClip.findByName(clips, 'Armature|mixamo.com|Layer0.001'/*'Armature|mixamo.com|Layer0.002'*/);
//             const action = mixer.clipAction(clip);
//             action.play();
//             mixers.push(mixer);
//         }
//     }

//     console.log(scene.children.length);
// });


            
       
       
// window.addEventListener('mousedown', function() {
//     const objectExist = objects.find(function(object) {
//         return (object.position.x === highlightMesh.position.x) && (object.position.z === highlightMesh.position.z);
//     });

//     if (shiftKeyPressed) {
//         // Se a tecla Shift estiver pressionada, não remova o objeto, mas redefina intersects.length para zero
//         intersects.length = 0;
//     } else {
//         // Se a tecla Shift não estiver pressionada, adicione o modelo
//         if (!objectExist && intersects.length > 0) {
//             const stagClone = SkeletonUtils.clone(stag);
//             stagClone.position.copy(highlightMesh.position);
//             scene.add(stagClone);
//             objects.push(stagClone);

//             highlightMesh.material.color.setHex(0xFF0000);

//             const mixer = new THREE.AnimationMixer(stagClone);
//             const clip = THREE.AnimationClip.findByName(clips, 'Armature|mixamo.com|Layer0.001'/*'Armature|mixamo.com|Layer0.002'*/);
//             const action = mixer.clipAction(clip);
//             action.play();
//             mixers.push(mixer);
//         }
//     }

//     console.log(scene.children.length);
// });

       
       
            
            
            





            





//ANIMAÇÃO
  const clock = new THREE.Clock();

function animate(time) {
    highlightMesh.material.opacity = 1 + Math.sin(time / 120);
    // objects.forEach(function(object) {
        //     object.rotation.x = time / 1000;
        //     object.rotation.z = time / 1000;
        //     object.position.y = 0.5 + 0.5 * Math.abs(Math.sin(time / 1000));
        // });
    // if(mixer)
    //     mixer.update(clock.getDelta());
    const delta = clock.getDelta();
    mixers.forEach(function(mixer) {
        mixer.update(delta);
    });
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});