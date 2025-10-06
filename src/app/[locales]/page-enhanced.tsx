import { getServerSession } from 'next-auth'

import { BuilderAnimated, Controls } from '@/components/ui'
import { SavedTemplates } from '@/components/ui/builder/saved-templates'
import { ShareBurger } from '@/components/ui/builder/share-burger'
import { UndoRedoControls } from '@/components/ui/builder/undo-redo-controls'
import { Total } from '@/components/ui/total/total'
import { TotalMobile } from '@/components/ui/total/total-mobile'
import { IngredientsState } from '@/redux/slices/ingredients-enhanced'

import { authOptions } from '../../../libs'

export default async function Home() {
    const session = await getServerSession(authOptions)

    const emptyIngredients: IngredientsState['ingredients'] = {
        salad: 0,
        bacon: 0,
        cheese: 0,
        meat: 0
    }

    return (
        <div>
            <div className="container-lg hidden sm:block">
                <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-8">
                    <div className="flex flex-col">
                        <UndoRedoControls />

                        <BuilderAnimated ingredients={emptyIngredients} />

                        <Controls />

                        <SavedTemplates />

                        <ShareBurger />
                    </div>

                    <div className="sticky top-4 h-fit">
                        <Total />
                    </div>
                </div>
            </div>

            <div className="block sm:hidden">
                <UndoRedoControls />

                <BuilderAnimated ingredients={emptyIngredients} />

                <Controls />

                <SavedTemplates />

                <ShareBurger />

                <TotalMobile />
            </div>
        </div>
    )
}
