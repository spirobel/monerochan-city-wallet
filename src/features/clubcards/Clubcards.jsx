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
    const [items, setItems] = useState([]);
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                delay: 250,
                tolerance: 20,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );
    const main_wallet = useLiveQuery(
        () => db.wallet_config.orderBy('main_wallet').last()
    );
    const clubcards = useLiveQuery(
        async () => {
            if (!main_wallet) { return; }
            let card_list = main_wallet.card_list
            if (!card_list || typeof card_list[0] !== 'string') {
                //TODO add wallet_name to clubcards
                let card_list_array = await db.clubcards.where({ bought: 1 }).toArray()
                card_list = [];
                card_list_array.forEach(function (item) {
                    card_list.push(item.url);
                });



                await db.wallet_config.update(main_wallet.name, {
                    card_list
                })
            }

            setItems(() => card_list)
        },
        [main_wallet, setItems]
    );


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
                const newArray = arrayMove(items, oldIndex, newIndex);
                db.wallet_config.update(main_wallet.name, {
                    card_list: newArray
                })
                return newArray
            });
        }
    }
}