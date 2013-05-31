<?php

namespace DTB\BdBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;

class CandidatureType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('coverLetter', 'textarea', array('label' => "Lette de Motivation"))
        ;
    }

    public function setDefaultOptions(OptionsResolverInterface $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'DTB\BdBundle\Entity\Candidature'
        ));
    }

    public function getName()
    {
        return 'dtb_bdbundle_candidaturetype';
    }
}
