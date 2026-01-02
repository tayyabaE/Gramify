import React from 'react'
import { FaCamera, FaFilm, FaVideo } from 'react-icons/fa6'

const FormField = ({ label, name, id, placeholder, type, fieldType, value, options, error, handler, fileHandler }) => {
    return (
        <div 
            className={ "w-full flex flex-col items-start justify-start gap-1 border border-primary-500/20 focus-within:border-primary-500 px-4 py-2.5 mt-5 rounded-lg group duration-300" }
        >
            { 
                label && 
                <label 
                    htmlFor={ id } 
                    dangerouslySetInnerHTML={{ __html: label }}
                    className={ "text-sm -translate-x-2 px-2 text-secondary-500/35 bg-primary-100 -mt-6 group-focus-within:text-primary-500 font-medium duration-300" }
                />
            }
            {
                fieldType == "input" ?
                <input 
                    type={ type } name={ name } id={ id } placeholder={ placeholder } value={ value } onChange={ handler }
                    className='text-sm text-secondary-500 py-1 w-full outline-none border-none' 
                /> :
                fieldType == "textarea" ? 
                <textarea 
                    name={ name } id={ id } placeholder={ placeholder } rows={ 4 } value={ value } onChange={ handler } 
                    className='w-full text-secondary-500 outline-none border-none resize-none' 
                /> : 
                fieldType == "dropdown" ? 
                <select 
                    name={ name } id={ id } defaultValue={ value } onChange={ handler } 
                    className='text-sm text-secondary-500 py-1 w-full outline-none border-none' 
                >
                    <option value="0" disabled >Select { label }</option>
                    {
                        options && options.map(( opt, index ) => (
                            <option value={ opt.value } key={ index }>{ opt.text }</option>
                        ))
                    }
                </select> : 
                fieldType == "file" && 
                <div className='relative w-full flex flex-col items-center justify-center'>
                    <span className='text-secondary-500/20 text-sm mb-2 font-medium'>
                        { value ? value : "No file choosen" }
                    </span>
                    <div className='text-xl text-secondary-500/20 border-2 rounded-[10px] border-secondary-500/20 border-dashed flex items-center justify-center h-15 w-20'>
                        <FaVideo className='pointer-events-none' />
                    </div>
                    <input 
                        type={ "file" } name={ name } id={ id } placeholder={ placeholder } onChange={ fileHandler }
                        className='opacity-0 z-10 absolute left-0 top-0 w-full h-full outline-none border-none' 
                    />
                </div>

            }
            { error && <span className='text-xs text-red-600'>{ error }</span> }
        </div>
    )
}

export default FormField