---
date: 2023-09-28
title: Filosofía de la computación
---

# Filosofía de la computación

Actualizado: {{ date | date: '%Y-%m-%d' }} { .post-date }

## Ontología

En Angius et al (2021) nos mencionan dos aproximaciones para crear una ontología de los artefactos computacionales, conceptuales y tecnológicos.

### Dualidad hardware y software

La primera aproximación es a través de una dualidad conceptual: hardware versus software. Todo artefacto o sistema computacional se estudia en sus relaciones interiores desde las ciencias computacionales, pero dichos artefactos deben tener una contraparte física para ser útiles en la vida cotidiana, es decir, deben tener una implementación.

Esta muy sospechosa primer dualidad funciona bastante bien. Muestra la naturaleza dual del software, lo que nos permite, por ejemplo, tener una teoría de algoritmos y toda la epistemología que se desprende de allí.

Desde el punto de vista tecnológico, la división conceptual entre hardware y software puede volverse difusa. Más aún, ya dentro de una praxis, la construcción de metodologías requiere una ontología más fina. Esto nos lleva a una segunda aproximación ontológica.

## Niveles de abstracción (LoA)

En una segunda aproximación, categorizamos los artefactos computacionales de acuerdo con una jerarquía de niveles o capas de abstracción.

La abstracción como método es esencial en la construcción del aparato tecnológico informático. En lo técnico, interpretamos un sistema informático de acuerdo con sus observables, es decir, sus variables. Qué mediciones y observaciones tengamos a nuestra disposición definen el compromiso ontológico de dicho sistema, qué y para qué es, y por lo tanto representan una capa o nivel de abstracción del sistema.

Floridi (2016) presenta el esquema de un proceso de composición de una teoría a partiendo de la definición de un nivel de abstracción.

![[Excalidraw/Filosofía de la computación.excalidraw.md#^group=yvGPEUFv|600]]

Cualquier sistema informático es una capa de abstracción construida composicionalmente a partir de otros sistemas, es decir, crea meta-esructuras sobre otras ya existentes, creando nuevos observables para interpretar.

Primiero (2016) sigue este proceso e identifica a la información dentro de un sistema de cómputo como datos estructurados. Con esta perspectiva, identifica además una jerarquía de cuatro niveles de información:

- Operacional: es el nivel más elemental de la estructura de los datos: el nivel del procesador y el código máquina.
- Instruccional: este es el nivel de los lenguajes de programación con su sintaxis y semántica.
- Abstracta: es el nivel algorítmico, aquí ya hay independencia de la implementación.
- Intensional: es el nivel de la intensión original, es la base para la corrección de toda implementación.

## Epistemología y complejidad

La computación se estudia tradicionalmente desde tres pespectivas:

- como parte de las matemáticas,
- como disciplina científica,
- como ingeniería.

Aquí consideramos a la computación o informática como una disciplina compleja. Más allá de la técnica, la informática también tiene al menos perspectivas:

- lingüísticas,
- comunicacionales,
- éticas,
- sociales,
- filosóficas,
- metafísicas.

## Algoritmos, máquinas y lenguaje

La teoría matemática de la computación inicia en el seno de un paradigma de positivismo lógico, pero curiosamente acabo siendo uno de sus verdugos fatales, el otro fue el teorema de incompletud de Gödel.

Pasamos de la inexorable creatividad humana, al procedimiento efectivo, a la mecánica, al símbolo, a la abstracción, y finalmente al algoritmo y a su caracterización matemática como máquina de Turing. Aquí inicia la computación como ciencia independiente de las matemáticas.

La máquina de Turing es un autómata, es un dispositivo abstracto e ideal. Sin embargo, Turing sí da cuenta de la fisicalidad del dato y de su procesamiento. Cada operación de esta máquina abstracta corresponde con un movimiento en el espacio tridimensional, la cinta con los símbolos se desplaza, un símbolo se borra o se escribe.

Pero esta mecanicidad tiene ahora otra lectura. No se trata ya de trabajo, fuerza y energía, sino de procesamiento símbólico. Un autómata, conceptualizado mecánicamente o no, finalmente es una máquina lingüística.

Esto nos lleva a otra dualidad fundamental manifestada en la jerarquía de Chomsky: cada caracterización formal que hacemos de un lenguaje, es decir, una gramática formal, corresponde con un autómata que puede identificar los mensajes codificados con esa caracterización.

## Referencias

1. Angius, Nicola; Primiero, Giuseppe; Turner, Raymond. The Philosophy of Computer Science. The Stanford Encyclopedia of Philosophy (Spring 2021 Edition). Zalta, Edward N. (ed.). En línea: [https://plato.stanford.edu/archives/spr2021/entries/computer-science/](https://plato.stanford.edu/archives/spr2021/entries/computer-science/) { .break-word }
2. Floridi, Luciano. The method of abstraction. Cap. 7 en The Routledge handbook of information in the philosophy of computer science. Routledge. 2016. Versión en línea: [https://www.researchgate.net/publication/304988835_Information_in_the_Philosophy_of_Computer_Science](https://www.researchgate.net/publication/304988835_Information_in_the_Philosophy_of_Computer_Science) { .break-word }
3. Primiero, Giuseppe. Information in the philosophy of computer science. Cap. 10 en The Routledge handbook of information in the philosophy of computer science. Routledge. 2016. Versión en línea: [https://www.researchgate.net/publication/304988835_Information_in_the_Philosophy_of_Computer_Science](https://www.researchgate.net/publication/304988835_Information_in_the_Philosophy_of_Computer_Science) { .break-word }

tags:: [[notas/Abstracción|Abstracción]], [[notas/Hardware vs software|Hardware vs software]], [[notas/Algoritmo|Algoritmo]], [[notas/Máquina de Turing|Máquina de Turing]]
