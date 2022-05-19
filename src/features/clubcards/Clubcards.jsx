import React, { useState } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy,
} from '@dnd-kit/sortable';
import { Clubcard } from './Clubcard';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../utils/dexie_db'

import styles from './Clubcards.module.scss';

export function Clubcards() {
    const [items, setItems] = useState(['1', '2', '3', '4', '5', '6', '7', '8']);
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );
    const clubcards = useLiveQuery(
        async () => {
            return await db.clubcards.where({ bought: 1 }).toArray()
        },
    );
    console.log("bought clubcards", clubcards)

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={items}
                strategy={rectSortingStrategy}
            >
                <div className={styles.Clubcards}>
                    {items.map(id => <Clubcard key={id} id={id} />)}
                </div>
            </SortableContext>
        </DndContext>
    );

    function handleDragEnd(event) {
        const { active, over } = event;

        if (active.id !== over.id) {
            setItems((items) => {
                const oldIndex = items.indexOf(active.id);
                const newIndex = items.indexOf(over.id);

                return arrayMove(items, oldIndex, newIndex);
            });
        }
    }
}