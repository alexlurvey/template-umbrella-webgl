import { start } from '@thi.ng/hdom';
import { canvasWebGL } from '@thi.ng/hdom-components';
import {
    FLOAT1,
    assign,
    defMain,
    vec4,
} from '@thi.ng/shader-ast';
import {
    ModelSpec,
    ShaderSpec,
    compileModel,
    defShader,
    draw,
} from '@thi.ng/webgl';

const triangle = {
    attribs: {
        position: {
            data: new Float32Array([
                -0.5, -0.5, 0,
                0.5, -0.5, 0,
                0, 0.5, 0,
            ]),
            size: 3,
        }
    },
    num: 3
}

const shader: ShaderSpec = {
    vs: (gl, unis, ins, outs) => {
        return [
            defMain(() => [
                assign(gl.gl_Position, vec4(ins.position, FLOAT1)),
            ])
        ]
    },
    fs: (gl, unis, ins, outs) => {
        return [
            defMain(() => [
                assign(outs.fragColor, vec4(0)),
            ])
        ]
    },
    attribs: {
        position: 'vec3',
    },
    varying: {},
    uniforms: {},
}

const app = () => {
    let model: ModelSpec;
    const bg = 0.1;

    const canvas = canvasWebGL({
        init (_, gl) {
            model = compileModel(gl, <ModelSpec>{
                shader: defShader(gl, shader),
                ...triangle
            })
        },
        update (_, gl, __, _time) {
            if (!model) return;

            gl.clearColor(bg, bg, bg, 1);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            draw(model);
        }
    });

    return [canvas, { width: 800, height: 800 }];
}

const cancel = start(app());

if (process.env.NODE_ENV !== "production") {
    const hot = (<any>module).hot;
    hot && hot.dispose(cancel);
}